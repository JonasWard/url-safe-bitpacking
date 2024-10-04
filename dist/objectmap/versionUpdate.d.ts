import { DataEntry, DataEntryArray } from '../types/dataEntry';
import { SemanticlyNestedDataEntry } from '../types/semanticlyNestedDataEntry';
import { DefinitionArrayObject, ParserForVersion, ParsersForVersionObject } from '../types/versionParser';
/**
 * Method to parse a definitionArrayObject according to a given dataArray
 * @param definitionArrayObject
 * @param dataArray
 * @returns - new SemanticlyNestedDataEntry
 */
export declare const updateDataEntryObject: (definitionArrayObject: DefinitionArrayObject, dataArray: DataEntryArray) => SemanticlyNestedDataEntry;
/**
 * Get the default object for a given version
 * @param versionParser - The parsers for all versions
 * @param versionindex - The index of the version for which to get the default object
 * @returns - The default object for the given version
 * @throws - Error if no parser for the given version index
 */
export declare const getDefaultObject: (versionParser: ParsersForVersionObject, versionindex: number) => SemanticlyNestedDataEntry;
/**
 * Method that handles the updating of a single value in a SemanticlyNestedDataEntry object
 * @param data SemanticlyNestedDataEntry
 * @param newDataEntry updated DataEntry
 * @param parsersForVersion version object
 * @returns a newly created object in case of a key data description, otherwise the same object with just the new Data Entry value updated
 */
export declare const updateDataEntry: (data: SemanticlyNestedDataEntry, newDataEntry: DataEntry, parsersForVersion: ParserForVersion[]) => SemanticlyNestedDataEntry;
