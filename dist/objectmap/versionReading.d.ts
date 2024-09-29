import { DataDescription } from '../types/dataEntry';
import { SemanticlyNestedDataDescription, SemanticlyNestedDataEntry } from '../types/semanticlyNestedDataEntry';
import { DefinitionArrayObject, ParserForVersion } from '../types/versionParser';
/**
 * Method for finding the names of the variable data entries in the DefinitionArrayObject
 * @param definitionArrayObject - DefinitionArrayObject
 * @returns string[] - the key strings
 */
export declare const getVariableStrings: (definitionArrayObject: DefinitionArrayObject) => string[];
/**
 * Method that translates a DefinitionArrayObject into a SemanticlyNestedDataEntry
 * @param definitionArrayObject [DataEntry | [string, DefinitionArrayObject]]
 * @param startIndex
 * @returns
 */
export declare const nestedDataEntryArrayToObject: (definitionArrayObject: DefinitionArrayObject, startIndex: number) => SemanticlyNestedDataEntry;
export declare const parseUrlMethod: (url: string, parserVersions: ParserForVersion[]) => SemanticlyNestedDataEntry;
export declare const parseDownNestedDataDescription: (nestedDataDescription: SemanticlyNestedDataDescription) => DataDescription[];
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
