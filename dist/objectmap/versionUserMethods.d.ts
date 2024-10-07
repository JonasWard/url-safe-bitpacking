import { VersionArrayDefinitionType, VersionRangeType, VersionEnumSemantics, ParsersForVersionObject, SemanticlyNestedDataEntry, DataEntry, SemanticlyNestedValues } from '../types';
/**
 * Method to create version definition objects
 * @param {VersionArrayDefinitionType[]} versionArray  - version definition array
 * @param {VersionRangeType} versionBitCount - bit count
 * @param {VersionEnumSemantics[] | VersionEnumSemantics} enumSemanticsMapping - optional semantics mapping for enums. If not given, values will be numbers
 * @param {undefined | Record<string, string> | Record<string, string>[]} attributeSemanticsMapping - optional semantics mapping, if nothing given no semantics will be mapped
 * @returns ParsersForVersionObject
 */
export declare const createParserObject: (versionArray: VersionArrayDefinitionType[], versionBitCount: VersionRangeType, enumSemanticsMapping?: VersionEnumSemantics[] | VersionEnumSemantics, attributeSemanticsMapping?: Record<string, string>[] | Record<string, string>) => ParsersForVersionObject;
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
export declare const parseUrl: (urlSafeBase64: string, parserVersions: ParsersForVersionObject) => SemanticlyNestedDataEntry;
/**
 * Update a data entry in a SemanticlyNestedDataEntry
 * @param {DataEntry} updatedEntry - the updated data entry
 * @param {SemanticlyNestedDataEntry} currentObject - the current Data Object
 * @param {ParsersForVersionObject} parserVersions - the object containing the version parsers
 * @returns {SemanticlyNestedDataEntry} - the updated SemanticlyNestedDataEntry
 */
export declare const updateDataEntry: (updatedEntry: DataEntry, currentObject: SemanticlyNestedDataEntry, parserVersions: ParsersForVersionObject) => SemanticlyNestedDataEntry;
/**
 * Method to get the URLSafeBase64 representation of a SemanticlyNestedDataEntry
 * @param {SemanticlyNestedDataEntry} data - the data object
 * @returns {string} - the urlSafeBase64 representation
 */
export declare const getURLSafeBase64ForData: (data: SemanticlyNestedDataEntry) => string;
/**
 * Method for getting the basic object for a given semanticly nested data entry
 * @param {SemanticlyNestedDataEntry} data - the data object
 * @returns {SemanticlyNestedDataEntry} - the basic object
 */
export declare const getSemanticallyNestedValues: (data: SemanticlyNestedDataEntry, parserVersions: ParsersForVersionObject) => SemanticlyNestedValues;
