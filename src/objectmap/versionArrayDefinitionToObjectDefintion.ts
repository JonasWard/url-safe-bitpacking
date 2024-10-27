import { DataEntryFactory } from '../factory';
import {
  DataEntry,
  DefinitionDerivativeMethod,
  DefinitionNestedArray,
  DefinitionDerivativeObject,
  DefinitionSubObject,
  VersionDefinitionObject,
  VersionDataEntry,
} from '../types';
import {
  EnumEntryDataType,
  PREFIX_SEPERATOR_DELIMETER,
  OptionalEntryDataType,
  NestedContentType,
  NestedContentDataType,
  SingleLevelContentType,
  VersionArrayDefinitionType,
  NonEmptyValidEntryArrayType,
  ArrayEntryDataType,
} from '../types/arrayDefinitions';

export const isSingleLevelContentType = (data: NestedContentType): boolean =>
  singleLevelContentTypeIsDataEntry(data[0] as SingleLevelContentType) ||
  (singleLevelContentTypeIsNestedContentDataType(data[0] as SingleLevelContentType) && !doubleLevelContentTypeIsArrayDefinitionType(data));
export const isDoubleLevelContentType = (data: NestedContentType): boolean => !isSingleLevelContentType(data);
export const singleLevelContentTypeIsDataEntry = (data: SingleLevelContentType): boolean => !Array.isArray(data) && typeof data === 'object';
export const singleLevelContentTypeIsNestedContentDataType = (data: SingleLevelContentType): boolean => Array.isArray(data) && typeof data[0] === 'string';

export const doubleLevelContentTypeIsEnumEntryDataType = (data: NestedContentType): boolean => isDoubleLevelContentType(data) && typeof data[0] === 'number';
export const doubleLevelContentTypeIsOptionalEntryDataType = (data: NestedContentType): boolean =>
  isDoubleLevelContentType(data) && typeof data[0] === 'boolean';
export const doubleLevelContentTypeIsArrayDefinitionType = (data: NestedContentType): boolean =>
  Array.isArray(data[0]) && data[0].length === 2 && typeof data[0][0] === 'number' && typeof data[0][1] === 'number';

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
): DefinitionNestedArray | DefinitionDerivativeObject => {
  const [attributeName, localData] = data;

  if (isSingleLevelContentType(localData))
    return [attributeName, localData.map((v) => parseSingleLevelContentTypeToDefinitionSubObject(v as NestedContentDataType, internalPrecedingName))];
  else if (doubleLevelContentTypeIsEnumEntryDataType(localData))
    return parseEnumEntryDataTypeToDefinitionNestedGenerationObject(localData as EnumEntryDataType, attributeName, internalPrecedingName);
  else if (doubleLevelContentTypeIsOptionalEntryDataType(localData))
    return parseOptionalEntryDataTypeToDefinitionNestedGenerationObject(localData as OptionalEntryDataType, attributeName, internalPrecedingName);
  else if (doubleLevelContentTypeIsArrayDefinitionType(localData))
    return parseArrayEntryDataTypeToDefinitionNestedGenerationObject(localData as ArrayEntryDataType, attributeName, internalPrecedingName);
  else {
    throw new Error('this is an invalid output value, wonder why?');
  }
};

export const parseEnumEntryDataTypeToDefinitionNestedGenerationObject = (
  data: EnumEntryDataType,
  name: string,
  internalPrecedingName?: string
): DefinitionDerivativeObject => {
  if (Math.round(data[0]) !== data[0]) `given default (${data[0]}) value isn't an integer, rounding it`;
  if (data.length - 2 < Math.round(data[0]))
    console.log(`given default value (${data[0]}) was larger than the amount of options available, using the largest value (${data.length - 2}) instead`);
  if (data[0] < 0) console.log(`given default value (${data[0]}) was negative, using first index (0) instead`);
  const dataEntry = parseDataEntry(
    DataEntryFactory.createEnum(Math.max(Math.min(data.length - 2, Math.round(data[0])), 0), data.length - 2, name),
    internalPrecedingName
  );
  const generationMethod: DefinitionDerivativeMethod = (d: DataEntry) => ({
    s: d,
    v: (data[(d.value as number) + 1] as NonEmptyValidEntryArrayType).map((v) => parseSingleLevelContentTypeToDefinitionSubObject(v, dataEntry.internalName)),
  });

  return [name, dataEntry, generationMethod];
};

export const parseOptionalEntryDataTypeToDefinitionNestedGenerationObject = (
  data: OptionalEntryDataType,
  name: string,
  internalPrecedingName?: string
): DefinitionDerivativeObject => {
  const dataEntry = parseDataEntry(DataEntryFactory.createBoolean(data[0], name), internalPrecedingName);
  const generationMethod: DefinitionDerivativeMethod = (d: DataEntry) => ({
    s: d,
    v: (data[Number(!(d.value as boolean)) + 1] as NonEmptyValidEntryArrayType).map((v) =>
      parseSingleLevelContentTypeToDefinitionSubObject(v, dataEntry.internalName)
    ),
  });

  return [name, dataEntry, generationMethod];
};

export const parseArrayEntryDataTypeToDefinitionNestedGenerationObject = (
  data: ArrayEntryDataType,
  name: string,
  internalPrecedingName?: string
): DefinitionDerivativeObject => {
  const dataEntry = parseDataEntry(DataEntryFactory.createInt(data[0][0], data[0][0], data[0][1], name), internalPrecedingName);
  const generationMethod: DefinitionDerivativeMethod = (d: DataEntry) => ({
    s: d,
    v: [Array(d.value as number)]
      .map((_, i) => data[1].map((v) => parseSingleLevelContentTypeToDefinitionSubObject(v, `${dataEntry.internalName}${PREFIX_SEPERATOR_DELIMETER}${i}`)))
      .flat(),
  });

  return [name, dataEntry, generationMethod];
};

export const parseDataEntry = (d: DataEntry, internalPrecedingName?: string): DataEntry =>
  internalPrecedingName ? { ...d, internalName: `${internalPrecedingName}${PREFIX_SEPERATOR_DELIMETER}${d.name}` } : d;

export const parseVersionArrayDefinitionTypeToVersionDefinitionObject = (
  v: VersionArrayDefinitionType,
  optionalIndexOverwrite?: number
): VersionDefinitionObject => [
  optionalIndexOverwrite ? { ...(parseDataEntry(v[0]) as VersionDataEntry), value: optionalIndexOverwrite } : (parseDataEntry(v[0]) as VersionDataEntry),
  ...v.slice(1).map((d) => parseSingleLevelContentTypeToDefinitionSubObject(d, '_')),
];
