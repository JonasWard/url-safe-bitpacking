import { DataType } from '../enums';
import { getMaxIntegerValueForGivenBitWidth } from '../factory/helperMethod';
import {
  VersionArrayDefinitionType,
  VersionRangeType,
  VersionEnumSemantics,
  ParsersForVersionObject,
  SemanticlyNestedDataEntry,
  DataEntry,
  SemanticlyNestedValues,
  DataEntryArray,
} from '../types';
import { parseVersionArrayDefinitionTypeToVersionDefinitionObject } from './versionArrayDefinitionToObjectDefintion';
import { parseUrlMethod, getURLForData, nestedDataEntryArrayToObject, parseDownNestedDataDescription } from './versionReading';
import { updateDataEntry as updateDataEntryObject } from './versionUpdate';

// her the methods are defined that the user reasonably is expected to use

/**
 * Method to create version definition objects
 * @param {VersionArrayDefinitionType[]} versionArray  - version definition array
 * @param {VersionRangeType} versionBitCount - bit count
 * @param {VersionEnumSemantics[] | VersionEnumSemantics} enumSemanticsMapping - optional semantics mapping for enums. If not given, values will be numbers
 * @param {undefined | Record<string, string> | Record<string, string>[]} attributeSemanticsMapping - optional semantics mapping, if nothing given no semantics will be mapped
 * @returns ParsersForVersionObject
 */
export const createParserObject = (
  versionArray: VersionArrayDefinitionType[],
  versionBitCount: VersionRangeType,
  enumSemanticsMapping?: VersionEnumSemantics[] | VersionEnumSemantics,
  attributeSemanticsMapping?: Record<string, string>[] | Record<string, string>
): ParsersForVersionObject => {
  const maxAllowedParsers = getMaxIntegerValueForGivenBitWidth(versionBitCount);

  if (versionArray.length > maxAllowedParsers) throw new Error(`Cannot have more than ${maxAllowedParsers} versions`);

  return {
    versionBitCount,
    parsers: versionArray.map((version, index) => ({
      attributeSemanticsMapping: attributeSemanticsMapping
        ? Array.isArray(attributeSemanticsMapping)
          ? attributeSemanticsMapping[index]
          : attributeSemanticsMapping
        : undefined,
      enumSemanticsMapping: enumSemanticsMapping ? (Array.isArray(enumSemanticsMapping) ? enumSemanticsMapping[index] : enumSemanticsMapping) : undefined,
      definition: parseVersionArrayDefinitionTypeToVersionDefinitionObject(version, index),
    })),
  };
};

/** the data object needs to be accesible in 3 versions.
 *
 * 1. As a semanticly nested object (primary data structure, also used for UI)
 * 2. As an array of entries (derived from semanticly nested object, to translate and from to bitstream)
 * 3. As an object with all the data entry information stripped (derived from semanticly nested object, read only)
 */

/**
 * Construct SemanticlyNestedDataEntry
 * @param urlSafeBase64 - the url to parse
 * @param parserVersions - the object containing the version parsers
 * @returns the parsed SemanticlyNestedDataEntry
 */
export const parseUrl = (urlSafeBase64: string, parserVersions: ParsersForVersionObject): SemanticlyNestedDataEntry =>
  parseUrlMethod(urlSafeBase64, parserVersions);

/**
 * Update a data entry in a SemanticlyNestedDataEntry
 * @param {DataEntry} updatedEntry - the updated data entry
 * @param {SemanticlyNestedDataEntry} currentObject - the current Data Object
 * @param {ParsersForVersionObject} parserVersions - the object containing the version parsers
 * @returns {SemanticlyNestedDataEntry} - the updated SemanticlyNestedDataEntry
 */
export const updateDataEntry = (
  updatedEntry: DataEntry,
  currentObject: SemanticlyNestedDataEntry,
  parserVersions: ParsersForVersionObject
): SemanticlyNestedDataEntry => updateDataEntryObject(currentObject, updatedEntry, parserVersions.parsers);

/**
 * Method to get the URLSafeBase64 representation of a SemanticlyNestedDataEntry
 * @param {SemanticlyNestedDataEntry} data - the data object
 * @returns {string} - the urlSafeBase64 representation
 */
export const getURLSafeBase64ForData = (data: SemanticlyNestedDataEntry): string => getURLForData(data);

const internalParseDataEntry = (data: DataEntry, enumSemanticsMapping?: VersionEnumSemantics): string | number | boolean => {
  if (data.type === DataType.ENUM && enumSemanticsMapping) {
    const mapping = enumSemanticsMapping[data.name]?.find((entry) => entry.value === data.value);
    if (mapping) return mapping.label;
  }
  return data.value;
};

const internalStrictSemanticallyNestedValues = (
  data: SemanticlyNestedDataEntry,
  enumSemanticsMapping?: VersionEnumSemantics,
  attributeSemanticsMapping?: Record<string, string>
): SemanticlyNestedValues =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      attributeSemanticsMapping ? attributeSemanticsMapping[key] ?? key : key,
      Array.isArray(value)
        ? value.map((subValue) => internalStrictSemanticallyNestedValues(subValue, enumSemanticsMapping, attributeSemanticsMapping))
        : value.type !== undefined
        ? internalParseDataEntry(value as DataEntry, enumSemanticsMapping)
        : internalStrictSemanticallyNestedValues(value as SemanticlyNestedDataEntry, enumSemanticsMapping, attributeSemanticsMapping),
    ])
  );

/**
 * Method for getting the basic object for a given semanticly nested data entry
 * @param {SemanticlyNestedDataEntry} data - the data object
 * @returns {SemanticlyNestedDataEntry} - the basic object
 */
export const getSemanticallyNestedValues = (data: SemanticlyNestedDataEntry, parserVersions: ParsersForVersionObject): SemanticlyNestedValues => {
  // get the version object
  const versionNumber = (data.version as DataEntry).value as number;
  const enumSemanticsMapping = parserVersions.parsers[versionNumber]?.enumSemanticsMapping;
  const attributeSemanticsMapping = parserVersions.parsers[versionNumber]?.attributeSemanticsMapping;

  // will actually be a version object so it data can never be just a data entry
  return internalStrictSemanticallyNestedValues(data, enumSemanticsMapping, attributeSemanticsMapping);
};

/**
 * Method to get the default object for a given version
 * @param {ParsersForVersionObject} parserForVersions - the object containing the version parsers
 * @param {number} versionindex - number of the version you want to generate the default object for
 * @returns SemanticlyNestedDataEntry
 */
export const getDefaultObject = (parserForVersions: ParsersForVersionObject, versionindex: number): SemanticlyNestedDataEntry => {
  if (!parserForVersions.parsers[versionindex]) throw new Error(`No parser for version ${versionindex} index`);
  return nestedDataEntryArrayToObject(parserForVersions.parsers[versionindex].definition) as SemanticlyNestedDataEntry;
};

/**
 * Method to get the get a (sorted by index) flat array of a SemanticallyNestedDataEntry
 * @param {SemanticlyNestedDataEntry} data - the semanticly nested data entry to flatten
 * @returns DataEntryArray
 */
export const getFlatArray = (data: SemanticlyNestedDataEntry): DataEntryArray => parseDownNestedDataDescription(data);
