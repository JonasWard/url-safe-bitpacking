import { DataEntryFactory } from '../factory';
import {
  DataEntry,
  DefinitionArrayObject,
  DefinitionGenerationObject,
  DefinitionNestedArray,
  DefinitionNestedGenerationObject,
  DefinitionSubObject,
  VersionDefinitionObject,
  VersionDataEntry,
} from '../types';
import {
  EnumEntryDataType,
  NAME_DELIMETER,
  OptionalEntryDataType,
  NestedContentType,
  NestedContentDataType,
  SingleLevelContentType,
  VersionArrayDefinitionType,
  NonEmptyValidEntryArrayType,
} from '../types/arrayDefinitions';

export const isSingleLevelContentType = (data: NestedContentType): boolean =>
  singleLevelContentTypeIsDataEntry(data[0] as SingleLevelContentType) || singleLevelContentTypeIsNestedContentDataType(data[0] as SingleLevelContentType);
export const isDoubleLevelContentType = (data: NestedContentType): boolean => !isSingleLevelContentType(data);
export const singleLevelContentTypeIsDataEntry = (data: SingleLevelContentType): boolean => !Array.isArray(data) && typeof data === 'object';
export const singleLevelContentTypeIsNestedContentDataType = (data: SingleLevelContentType): boolean => Array.isArray(data) && typeof data[0] === 'string';

export const singleLevelContentTypeIsEnumEntryDataType = (data: NestedContentType): boolean => isDoubleLevelContentType(data) && typeof data[0] === 'number';
export const singleLevelContentTypeIsOptionalEntryDataType = (data: NestedContentType): boolean =>
  isDoubleLevelContentType(data) && typeof data[0] === 'boolean';

export const parseSingleLevelContentTypeToDefinitionSubObject = (data: SingleLevelContentType, internalPrecedingName?: string): DefinitionSubObject => {
  if (singleLevelContentTypeIsDataEntry(data)) return parseDataEntry(data as DataEntry, internalPrecedingName);
  else if (singleLevelContentTypeIsNestedContentDataType(data))
    return parseNestedContentDataTypeToDefinitionNestedArray(data as NestedContentDataType, internalPrecedingName);
  else {
    throw new Error('this is an invalid output value, wonder why?');
  }
};

export const parseNestedContentDataTypeToDefinitionNestedArray = (
  data: NestedContentDataType,
  internalPrecedingName?: string
): DefinitionNestedArray | DefinitionNestedGenerationObject => {
  const [attributeName, localData] = data;

  if (isSingleLevelContentType(localData))
    return [attributeName, localData.map((v) => parseSingleLevelContentTypeToDefinitionSubObject(v as NestedContentDataType, internalPrecedingName))];
  else if (singleLevelContentTypeIsEnumEntryDataType(localData))
    return parseEnumEntryDataTypeToDefinitionNestedGenerationObject(localData as EnumEntryDataType, attributeName, internalPrecedingName);
  else if (singleLevelContentTypeIsOptionalEntryDataType(localData))
    return parseOptionalEntryDataTypeToDefinitionNestedGenerationObject(localData as OptionalEntryDataType, attributeName, internalPrecedingName);
  else {
    throw new Error('this is an invalid output value, wonder why?');
  }
};

export const parseEnumEntryDataTypeToDefinitionNestedGenerationObject = (
  data: EnumEntryDataType,
  name: string,
  internalPrecedingName?: string
): DefinitionNestedGenerationObject => {
  if (Math.round(data[0]) !== data[0]) `given default (${data[0]}) value isn't an integer, rounding it`;
  if (data.length - 2 < Math.round(data[0]))
    console.log(`given default value (${data[0]}) was larger than the amount of options available, using the largest value (${data.length - 2}) instead`);
  if (data[0] < 0) console.log(`given default value (${data[0]}) was negative, using first index (0) instead`);
  const dataEntry = parseDataEntry(
    DataEntryFactory.createEnum(Math.max(Math.min(data.length - 2, Math.round(data[0])), 0), data.length - 2, name),
    internalPrecedingName
  );
  const generationMethod: DefinitionGenerationObject = (d: DataEntry): DefinitionArrayObject => [
    d,
    ...(data[(d.value as number) + 1] as NonEmptyValidEntryArrayType).map((v) => parseSingleLevelContentTypeToDefinitionSubObject(v, dataEntry.internalName)),
  ];

  return [name, dataEntry, generationMethod];
};

export const parseOptionalEntryDataTypeToDefinitionNestedGenerationObject = (
  data: OptionalEntryDataType,
  name: string,
  internalPrecedingName?: string
): DefinitionNestedGenerationObject => {
  const dataEntry = parseDataEntry(DataEntryFactory.createBoolean(data[0], name), internalPrecedingName);
  const generationMethod: DefinitionGenerationObject = (d: DataEntry): DefinitionArrayObject => [
    d,
    ...(data[Number(!(d.value as boolean)) + 1] as NonEmptyValidEntryArrayType).map((v) =>
      parseSingleLevelContentTypeToDefinitionSubObject(v, dataEntry.internalName)
    ),
  ];

  return [name, dataEntry, generationMethod];
};

export const parseDataEntry = (d: DataEntry, internalPrecedingName?: string): DataEntry =>
  internalPrecedingName ? { ...d, internalName: `${internalPrecedingName}${NAME_DELIMETER}${d.name}` } : d;

export const parseVersionArrayDefinitionTypeToVersionDefinitionObject = (v: VersionArrayDefinitionType): VersionDefinitionObject => [
  parseDataEntry(v[0]) as VersionDataEntry,
  ...v.slice(1).map((d) => parseSingleLevelContentTypeToDefinitionSubObject(d, '_')),
];
