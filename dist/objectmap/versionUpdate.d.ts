import { DataEntry, DataEntryArray } from '../types/dataEntry';
import { SemanticlyNestedDataEntry } from '../types/semanticlyNestedDataEntry';
import { DefinitionArrayObject, ParserForVersion } from '../types/versionParser';
/**
 * Method to parse a definitionArrayObject according to a given dataArray
 * @param definitionArrayObject
 * @param dataArray
 * @returns - new SemanticlyNestedDataEntry
 */
export declare const updateDataEntryObject: (definitionArrayObject: DefinitionArrayObject, dataArray: DataEntryArray) => SemanticlyNestedDataEntry;
export declare const getDefaultObject: (versionObjects: ParserForVersion[], versionindex: number) => SemanticlyNestedDataEntry;
/**
 * Method that handles the updating of a single value in a SemanticlyNestedDataEntry object
 * @param data SemanticlyNestedDataEntry
 * @param newDataEntry updated DataEntry
 * @param versionObjects version object
 * @returns a newly created object in case of a key data description, otherwise the same object with just the new Data Entry value updated
 */
export declare const updateDataEntry: (data: SemanticlyNestedDataEntry, newDataEntry: DataEntry, versionObjects: ParserForVersion[]) => SemanticlyNestedDataEntry;
