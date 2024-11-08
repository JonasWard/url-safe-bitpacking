import { DataEntryFactory } from '../factory';
import {
  doubleLevelContentTypeIsArrayDefinitionType,
  doubleLevelContentTypeIsEnumEntryDataType,
  doubleLevelContentTypeIsOptionalEntryDataType,
  isDataEntry,
  isDoubleLevelContentType,
} from '../objectmap';
import {
  ArrayEntryDataType,
  DataEntry,
  DoubleLevelContentType,
  EnumEntryDataType,
  NestedContentDataType,
  NestedContentType,
  NonEmptyValidEntryArrayType,
  OptionalEntryDataType,
  SingleLevelContentType,
  VersionContentDefinition,
} from '../types';
import { getDataEntryTypeString, getStateDataContentType } from './dataEntryTyping';

const intendationString = '  ';

const increaseIndentation = (s: string): string =>
  s
    .split('\n')
    .map((s) => `${intendationString}${s}`)
    .join('\n');
const getObjectStringForAttributesArray = (attributes: string[]) => `{\n${attributes.map(increaseIndentation).join(',\n')}\n}`;
const getUnionType = (stateDataStrings: string[]) => stateDataStrings.join(' |\n');

export const getVersionContentTypeFile = (versionContent: VersionContentDefinition): string =>
  getUnionType(versionContent.map(getStateDataTypeForSingleLevelContentTypeArray));

export const getStateDataTypeForSingleLevelContentTypeArray = (slcta: SingleLevelContentType[]): string =>
  getObjectStringForAttributesArray(slcta.map(getStateDataTypeForSingleLevelContentType));

export const getStateDataTypeForSingleLevelContentType = (slct: SingleLevelContentType): string =>
  isDataEntry(slct)
    ? getStateDataContentType(slct as DataEntry)
    : `["${(slct as NestedContentDataType)[0]}"]: ${getStateDataTypeNestedContentType((slct as NestedContentDataType)[1], (slct as NestedContentDataType)[0])}`;

export const getStateDataTypeNestedContentType = (ncdt: NestedContentType, attributeName: string): string =>
  isDoubleLevelContentType(ncdt)
    ? getStateDataTypeForDoubleLevelContentType(ncdt as DoubleLevelContentType, attributeName)
    : getStateDataTypeForSingleLevelContentTypeArray(ncdt as SingleLevelContentType[]);

export const getStateDataTypeForDoubleLevelContentType = (dncdt: DoubleLevelContentType, attributeName: string): string => {
  if (doubleLevelContentTypeIsOptionalEntryDataType(dncdt)) return getStateDataTypeForOptionalEntryDataType(dncdt as OptionalEntryDataType, attributeName);
  else if (doubleLevelContentTypeIsEnumEntryDataType(dncdt)) return getStateDataTypeForEnumEntryDataType(dncdt as EnumEntryDataType, attributeName);
  else if (doubleLevelContentTypeIsArrayDefinitionType(dncdt)) return getStateDataTypeForArrayEntryDataType(dncdt as ArrayEntryDataType, attributeName);
  throw new Error('mistake when creating type');
};

const derivativeStateComposer = (s: DataEntry, v: string): string => `{
${intendationString}s: ${getDataEntryTypeString(s, false, true)},
${intendationString}v: 
${increaseIndentation(v)}
}`;

export const getStateDataTypeForOptionalEntryDataType = (oedt: OptionalEntryDataType, attributeName: string): string => {
  const dataEntryTrue = DataEntryFactory.createBoolean(true, attributeName);
  const dataEntryFalse = DataEntryFactory.createBoolean(false, attributeName);

  const contentTrue = getStateDataTypeForSingleLevelContentTypeArray(oedt[1]);
  const contentFalse = getStateDataTypeForSingleLevelContentTypeArray(oedt[2]);

  return `${increaseIndentation(derivativeStateComposer(dataEntryTrue, contentTrue))} | 
  ${increaseIndentation(derivativeStateComposer(dataEntryFalse, contentFalse))}`;
};

export const getStateDataTypeForEnumEntryDataType = (eedt: EnumEntryDataType, attributeName: string): string => {
  const strings = eedt
    .slice(1)
    .map((slct, index, arr) =>
      derivativeStateComposer(
        DataEntryFactory.createEnum(index, arr.length - 1, attributeName),
        getStateDataTypeForSingleLevelContentTypeArray(slct as SingleLevelContentType[] | NonEmptyValidEntryArrayType)
      )
    );

  return `${strings.map(increaseIndentation).join(' |\n')}`;
};

const getStateDataArrayForArrayEntryDataTypeEntry = (count: number, content: string): string => `[
${increaseIndentation([...Array(count)].map((_) => content).join(',\n'))}
]`;

export const getStateDataTypeForArrayEntryDataType = (aedt: ArrayEntryDataType, attributeName: string): string => {
  const baseDate = getStateDataTypeForSingleLevelContentTypeArray(aedt[1]);
  const strings = [...Array(aedt[0][1] - aedt[0][0])].map((_, i) => {
    const dataEntry = DataEntryFactory.createInt(i + aedt[0][0], aedt[0][0], aedt[0][1], attributeName);
    const slcta = getStateDataArrayForArrayEntryDataTypeEntry(dataEntry.value + 1, baseDate);
    return derivativeStateComposer(dataEntry, slcta);
  });
  return `${strings.map(increaseIndentation).join(' |\n')}`;
};
