import { DataEntryFactory } from '../factory';
import { getVersionValueRangeValueForNumber } from '../factory/helperMethod';
import { parseBase64ToBits } from '../parsers';
import {
  VersionRangeType,
  EnumSemantics,
  VersionHandler,
  StateDataType,
  VersionDataEntry,
  ExposedParserStateDataMethod,
  DataEntryArray,
  SingleLevelContentType,
  DataEntry,
  UpdateStateDataMethod,
  StringifyStateDataMethod,
  VersionContentDefinition,
} from '../types';
import { getGenerationMethodForSingleLevelContentTypeArray, getStateDateFromSingleLevelContentTypeArray, readDataEntry } from './stateDataModel';
import { getBase64String, getDataEntryArray } from './stateValueHelperMethods';

const getParsedAdditionalData = (additionalData?: StateDataType | DataEntryArray | string): undefined | string | DataEntryArray => {
  if (typeof additionalData === 'string') return parseBase64ToBits(additionalData);
  if (additionalData && !Array.isArray(additionalData)) return getDataEntryArray(additionalData);
  return additionalData;
};

const getVersionindex = (additionalData: undefined | string | DataEntryArray, versionMask: VersionDataEntry, defaultIndex?: number): number => {
  if (typeof additionalData === 'string') return (readDataEntry(versionMask, additionalData)[1][1] as VersionDataEntry).value;
  if (!additionalData) return defaultIndex || 0;
  return (additionalData.find((d) => d.name === 'version') as VersionDataEntry | undefined)?.value ?? defaultIndex ?? 0;
};

const getParserMethodForVersionDefinition =
  (vadt: SingleLevelContentType[][], versionBits: VersionRangeType, defaultVersion?: number): ExposedParserStateDataMethod =>
  (state?: StateDataType | DataEntryArray | string): StateDataType => {
    const additionalData: undefined | string | DataEntryArray = getParsedAdditionalData(state);
    const versionIndex = getVersionindex(additionalData, DataEntryFactory.createVersion(0, versionBits, 'version'), defaultVersion);
    const versionDefinition = vadt[versionIndex];
    const versionEntry = DataEntryFactory.createVersion(versionIndex, versionBits, 'version');
    return getGenerationMethodForSingleLevelContentTypeArray([versionEntry, ...versionDefinition])(additionalData);
  };

const getUpdaterMethodForVersionDefinition =
  (parser: ExposedParserStateDataMethod): UpdateStateDataMethod =>
  (state: StateDataType, entryToUpdate: DataEntry) =>
    parser([entryToUpdate, ...getDataEntryArray(state)]);

const getStringifyMethodForVersionDefinition =
  (parser: ExposedParserStateDataMethod): StringifyStateDataMethod =>
  (data: StateDataType | DataEntryArray) =>
    getBase64String(parser(data));

/**
 * Method to create version definition objects
 * @param {VersionArrayDefinitionType[]} versionContent  - version definition array
 * @param {number} maximumExpectedVersions - maximum expected versions to define
 * @param {number} defaultVersion - number - optional, default it is the first,
 * @param {EnumSemantics[] | EnumSemantics} enumSemanticsMapping - optional - UI semantics mapping for enums. If not given, values will be numbers
 * @param {undefined | Record<string, string> | Record<string, string>[]} attributeSemanticsMapping - optional - UI semantics mapping, if nothing given no semantics will be mapped
 * @param {number[]} exposedVersions?: number[] - optional - UI semantics, masks which objects to show and hide
 * @returns ParsersForVersionObject
 */
export const createParserObject = (
  versionContent: VersionContentDefinition,
  maximumExpectedVersions: number,
  defaultVersion?: number,
  enumSemanticsMapping?: EnumSemantics | EnumSemantics[],
  attributeSemanticsMapping?: Record<string, string> | Record<string, string>[],
  exposedVersions?: number[]
): VersionHandler => {
  const versionBitCount = getVersionValueRangeValueForNumber(maximumExpectedVersions);

  if (versionContent.length > maximumExpectedVersions) throw new Error(`Cannot have more than ${maximumExpectedVersions} versions`);
  if (Math.max(0, Math.min(versionContent.length - 1, defaultVersion ?? 0)) !== (defaultVersion ?? 0))
    console.log(
      `Default version must be between 0 and ${versionContent.length - 1}, instead of ${defaultVersion} will be using ${Math.max(
        0,
        Math.min(versionContent.length - 1, defaultVersion ?? 0)
      )}`
    );

  const parser = getParserMethodForVersionDefinition(
    versionContent,
    versionBitCount,
    defaultVersion !== undefined ? Math.max(0, Math.min(versionContent.length - 1, defaultVersion)) : undefined
  );
  const updater = getUpdaterMethodForVersionDefinition(parser);
  const stringify = getStringifyMethodForVersionDefinition(parser);

  return {
    versionBitCount,
    exposedVersions,
    parser,
    updater,
    stringify,
    enumSemanticsMapping,
    attributeSemanticsMapping,
  };
};
