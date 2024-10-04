import { DataEntry } from '../types/dataEntry';
import { SemanticlyNestedDataEntry } from '../types/semanticlyNestedDataEntry';
import { DefinitionArrayObject, ParsersForVersionObject } from '../types/versionParser';
/**
 * Method for finding the names of the variable data entries in the DefinitionArrayObject
 * @param definitionArrayObject - DefinitionArrayObject
 * @returns string[] - the key strings
 */
export declare const getVariableStrings: (definitionArrayObject: DefinitionArrayObject) => string[];
/**
 * Method that translates a DefinitionArrayObject into a SemanticlyNestedDataEntry
 * @param definitionArrayObject [DataEntry | [string, DefinitionArrayObject]]
 * @returns
 */
export declare const nestedDataEntryArrayToObject: (definitionArrayObject: DefinitionArrayObject) => SemanticlyNestedDataEntry;
/**
 * Method to parse a url into a SemanticlyNestedDataEntry.
 * @param url - the url to parse
 * @param parserVersions - the object containing the version parsers
 * @returns the parsed SemanticlyNestedDataEntry
 */
export declare const parseUrlMethod: (url: string, parserVersions: ParsersForVersionObject) => SemanticlyNestedDataEntry;
export declare const parseDownNestedDataDescription: (nestedDataDescription: SemanticlyNestedDataEntry) => DataEntry[];
/**
 * Method to get an URL descriptor from a SemanticlyNestedDataEntry
 * @param data: SemanticlyNestedDataEntry
 * @returns base64 string
 */
export declare const getURLForData: (data: SemanticlyNestedDataEntry) => string;
export declare const getTestStringValues: (data: SemanticlyNestedDataEntry) => {
    bitsString: string;
    base64BitString: string;
    base64SplitString: string;
    base64String: string;
    raw: string;
};
