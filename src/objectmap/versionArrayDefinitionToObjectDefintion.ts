import { DataEntryFactory } from '../factory';
import {
  DataEntry,
  DefinitionArrayObject,
  DefinitionGenerationObject,
  DefinitionNestedArray,
  DefinitionNestedGenerationObject,
  DefinitionSubObject,
  VersionDefinitionObject,
  VersionDescriptionWithValueType,
} from '../types';
import {
  EnumEntryDataType,
  INDEX_DELIMETER,
  NAME_DELIMETER,
  OptionalEntryDataType,
  NestedContentType,
  NestedContentDataType,
  SingleLevelContentType,
  VersionArrayDefinitionType,
  NonEmptyValidEntryArrayType,
} from '../types/arrayDefinitions';

export const isSingleLevelContentType = (data: NestedContentType) =>
  singleLevelContentTypeIsDataEntry(data[0] as SingleLevelContentType) || singleLevelContentTypeIsNestedContentDataType(data[0] as SingleLevelContentType);
export const isDoubleLevelContentType = (data: NestedContentType) => !isSingleLevelContentType(data);
export const singleLevelContentTypeIsDataEntry = (data: SingleLevelContentType) => !Array.isArray(data) && typeof data === 'object';
export const singleLevelContentTypeIsNestedContentDataType = (data: SingleLevelContentType) => Array.isArray(data) && typeof data[0] === 'string';

export const singleLevelContentTypeIsEnumEntryDataType = (data: NestedContentType) => isDoubleLevelContentType(data) && typeof data[0] === 'number';
export const singleLevelContentTypeIsOptionalEntryDataType = (data: NestedContentType) => isDoubleLevelContentType(data) && typeof data[0] === 'boolean';

export const parseSingleLevelContentTypeToDefinitionSubObject = (data: SingleLevelContentType, currentIndex: number): [number, DefinitionSubObject] => {
  if (singleLevelContentTypeIsDataEntry(data)) return parseDataEntry(data as DataEntry, currentIndex);
  else if (singleLevelContentTypeIsNestedContentDataType(data))
    return parseNestedContentDataTypeToDefinitionNestedArray(data as NestedContentDataType, currentIndex);
  else {
    throw new Error('this is an invalid output value, wonder why?');
  }
};

export const parseNestedContentDataTypeToDefinitionNestedArray = (
  data: NestedContentDataType,
  currentIndex: number
): [number, DefinitionNestedArray | DefinitionNestedGenerationObject] => {
  const [attributeName, localData] = data;

  if (isSingleLevelContentType(localData)) {
    let localIndex = currentIndex;
    const parsedSingleLevelContentTypes: DefinitionSubObject[] = [];
    localData.forEach((v) => {
      const [resultIndex, resultData] = parseSingleLevelContentTypeToDefinitionSubObject(v as NestedContentDataType, localIndex);
      parsedSingleLevelContentTypes.push(resultData);
      localIndex = resultIndex;
    });
    return [localIndex, [attributeName, parsedSingleLevelContentTypes]];
  } else if (singleLevelContentTypeIsEnumEntryDataType(localData))
    return parseEnumEntryDataTypeToDefinitionNestedGenerationObject(localData as EnumEntryDataType, attributeName, currentIndex);
  else if (singleLevelContentTypeIsOptionalEntryDataType(localData))
    return parseOptionalEntryDataTypeToDefinitionNestedGenerationObject(localData as OptionalEntryDataType, attributeName, currentIndex);
  else {
    throw new Error('this is an invalid output value, wonder why?');
  }
};

export const parseEnumEntryDataTypeToDefinitionNestedGenerationObject = (
  data: EnumEntryDataType,
  name: string,
  currentIndex: number
): [number, DefinitionNestedGenerationObject] => {
  let localIndex = currentIndex + 1;
  if (Math.round(data[0]) !== data[0]) `given default (${data[0]}) value isn't an integer, rounding it`;
  if (data.length - 2 < Math.round(data[0]))
    console.log(`given default value (${data[0]}) was larger than the amount of options available, using the largest value (${data.length - 2}) instead`);
  if (data[0] < 0) console.log(`given default value (${data[0]}) was negative, using first index (0) instead`);
  const dataEntry = DataEntryFactory.createEnum(Math.max(Math.min(data.length - 2, Math.round(data[0])), 0), data.length - 2, name, localIndex);
  const generationMethod: DefinitionGenerationObject = (d: DataEntry): DefinitionArrayObject =>
    (data[(d.value as number) + 1] as NonEmptyValidEntryArrayType).map((v) => {
      const [newIndex, definitionSubObject] = parseSingleLevelContentTypeToDefinitionSubObject(v, localIndex);
      localIndex = newIndex;
      return definitionSubObject;
    });

  return [localIndex, [name, dataEntry, generationMethod]];
};

export const parseOptionalEntryDataTypeToDefinitionNestedGenerationObject = (
  data: OptionalEntryDataType,
  name: string,
  currentIndex: number
): [number, DefinitionNestedGenerationObject] => {
  let localIndex = currentIndex + 1;
  const dataEntry = DataEntryFactory.createBoolean(data[0], name, localIndex);
  const generationMethod: DefinitionGenerationObject = (d: DataEntry): DefinitionArrayObject =>
    (data[Number(!(d.value as boolean)) + 1] as NonEmptyValidEntryArrayType).map((v) => {
      const [newIndex, definitionSubObject] = parseSingleLevelContentTypeToDefinitionSubObject(v, localIndex);
      localIndex = newIndex;
      return definitionSubObject;
    });

  return [localIndex, [name, dataEntry, generationMethod]];
};

export const parseDataEntry = (d: DataEntry, currentIndex: number): [number, DataEntry] => {
  const localIndex = currentIndex + 1;

  return [localIndex, { ...d, index: localIndex }];
};

export const parseVersionArrayDefinitionTypeToVersionDefinitionObject = (v: VersionArrayDefinitionType): VersionDefinitionObject => {
  let localIndex = 0;
  // parse the version
  const [newIndex, version] = parseDataEntry(v[0] as DataEntry, localIndex);
  const outputVersionDefinitionArray: VersionDefinitionObject = [version as VersionDescriptionWithValueType];
  localIndex = newIndex;
  // parse the other entries
  v.slice(1).forEach((d) => {
    const [newIndex, dataEntry] = parseSingleLevelContentTypeToDefinitionSubObject(d, localIndex);
    localIndex = newIndex;
    outputVersionDefinitionArray.push(dataEntry);
  });

  return outputVersionDefinitionArray;
};
