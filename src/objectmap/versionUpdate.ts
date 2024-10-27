import { dataEntryCorrecting } from '../parsers/parsers';
import { DataEntry, DataEntryArray, VersionDataEntry } from '../types/dataEntry';
import { SemanticlyNestedDataEntry } from '../types/semanticlyNestedDataEntry';
import {
  DefinitionArrayObject,
  DefinitionNestedArray,
  DefinitionDerivativeObject,
  DefinitionSubObject,
  ParserForVersion,
  ParsersForVersionObject,
} from '../types/versionParser';
import { updateValue } from '../update/updateValues';
import { nestedDataEntryArrayToObject, parseDownNestedDataDescription } from './versionReading';

// don't alter or change this variable anywher, it used when creating objects to keep track of the current index of a nested object
// it's a bit hacky, but it gets the job done...
let currentObjectIndex = 0;

/**
 * Helper method for finding an existing data entry in case there was a previous object
 * @param dataEntry - new DataEntry
 * @param dataEntryArray - existing DataEntryArray
 */
const findExistingDataEntry = (dataEntry: DataEntry, dataEntryArray: DataEntryArray): DataEntry | undefined => {
  const dataEntryName = dataEntry.internalName ?? dataEntry.name;
  return dataEntryArray.find((d) => (d.internalName ?? d.name) === dataEntryName);
};

/**
 * Method that handles a single dataEntry object in an DefinitionArrayObject
 * @param dataEntry - DataEntry
 * @param dataEntryArray - DataEntryArray
 */
const dataEntryUpdating = (dataEntry: DataEntry, dataEntryArray: DataEntryArray): [string, DataEntry] => {
  const existingDataEntry = findExistingDataEntry(dataEntry, dataEntryArray);
  if (!existingDataEntry) return [dataEntry.name, { ...dataEntry, index: currentObjectIndex++ }];
  return [dataEntry.name, { ...updateValue(dataEntry, existingDataEntry), index: currentObjectIndex++ }];
};

/**
 * Method that handles the updating of a nested DefinitionArrayObject
 * @param definitionNestedArrray - DefinitionNestedArray
 * @param dataEntryArray - DataEntryArray
 */
const nestedDataEntryArrayUpdating = (definitionNestedArrray: DefinitionNestedArray, dataEntryArray: DataEntryArray): [string, SemanticlyNestedDataEntry] => {
  const [keyString, nestedDefinitionArray] = definitionNestedArrray;
  return [keyString, updateDataEntryObject(nestedDefinitionArray, dataEntryArray)];
};

/**
 * Method that handles the updating of of a DefinitionGenerationObject
 * @param definitionArrayObject - DefinitionNestedGenerationObject
 * @param dataEntryArray - DataEntryArray
 */
const generationObjectUpdating = (definitionArrayObject: DefinitionDerivativeObject, dataEntryArray: DataEntryArray): [string, SemanticlyNestedDataEntry] => {
  const [keyString, keyDataEntry, methodGenerator] = definitionArrayObject;
  const foundKeyDataEntry = findExistingDataEntry(keyDataEntry, dataEntryArray);
  const newKeyData = foundKeyDataEntry ? updateValue(keyDataEntry, foundKeyDataEntry) : keyDataEntry;
  return [keyString, updateDataEntryObject(methodGenerator(newKeyData), dataEntryArray)];
};

/**
 * Internal helper method
 */
const handleSubObject = (
  value: DefinitionSubObject,
  newNestedObject: SemanticlyNestedDataEntry,
  dataArray: DataEntryArray
): [string, DataEntry | SemanticlyNestedDataEntry | SemanticlyNestedDataEntry[]] => {
  if (Array.isArray(value)) {
    if (value.length === 2) {
      const [localKeyString, nestedDataEntry] = nestedDataEntryArrayUpdating(value as DefinitionNestedArray, dataArray);
      newNestedObject[localKeyString] = nestedDataEntry;
      return [localKeyString, nestedDataEntry];
    } else {
      const [localKeyString, nestedDataEntry] = generationObjectUpdating(value as DefinitionDerivativeObject, dataArray);
      newNestedObject[localKeyString] = nestedDataEntry;
      return [localKeyString, nestedDataEntry];
    }
  } else {
    const [localKeyString, dataEntry] = dataEntryUpdating(value, dataArray);
    newNestedObject[localKeyString] = dataEntry;
    return [localKeyString, dataEntry];
  }
};

/**
 * Method to parse a definitionArrayObject according to a given dataArray
 * @param definitionArrayObject
 * @param dataArray
 * @returns - new SemanticlyNestedDataEntry
 */
export const updateDataEntryObject = (definitionArrayObject: DefinitionArrayObject, dataArray: DataEntryArray): SemanticlyNestedDataEntry => {
  const newNestedObject: SemanticlyNestedDataEntry = {};
  definitionArrayObject.forEach((value) => handleSubObject(value, newNestedObject, dataArray));
  return newNestedObject;
};

/**
 * Internal method to update the values in a SemanticlyNestedDataEntry object in place
 * Should only be used after having created a new SemanticlyNestedDataEntry object
 * @param data SemanticlyNestedDataEntry, gets mutated in place
 * @param newDataEntry DataEntry to update
 * @returns same data object
 */
const updateValuesInDataEntryObject = (data: SemanticlyNestedDataEntry, newDataEntry: DataEntry) => {
  Object.values(data).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((subValue) => updateValuesInDataEntryObject(subValue, newDataEntry));
    } else if (value.hasOwnProperty('type')) {
      if (value.name === newDataEntry.name) value.value = newDataEntry.value;
    } else updateValuesInDataEntryObject(value as SemanticlyNestedDataEntry, newDataEntry);
  });

  return data;
};

/**
 * Get the default object for a given version
 * @param versionParser - The parsers for all versions
 * @param versionindex - The index of the version for which to get the default object
 * @returns - The default object for the given version
 * @throws - Error if no parser for the given version index
 */
export const getDefaultObject = (versionParser: ParsersForVersionObject, versionindex: number) => {
  if (!versionParser.parsers[versionindex]) throw new Error(`No parser for version ${versionindex} index`);
  return nestedDataEntryArrayToObject(versionParser.parsers[versionindex].definition) as SemanticlyNestedDataEntry;
};

/**
 * Method that handles the updating of a single value in a SemanticlyNestedDataEntry object
 * @param data SemanticlyNestedDataEntry
 * @param newDataEntry updated DataEntry
 * @param parsersForVersion version object
 * @returns a newly created object in case of a key data description, otherwise the same object with just the new Data Entry value updated
 */
export const updateDataEntry = (data: SemanticlyNestedDataEntry, newDataEntry: DataEntry, parsersForVersion: ParserForVersion[]): SemanticlyNestedDataEntry => {
  currentObjectIndex = 0; // version for some reason is not correctly indexed, but that is acceptable

  const version = data.version as VersionDataEntry;
  const versionParser = parsersForVersion[version.value];
  if (!versionParser) throw new Error(`No parser for version ${version.value}`);

  const correctedDataEntry = dataEntryCorrecting(newDataEntry);

  // create a new virgin object but replace the keyDataDescription with the new value
  const dataEntryArray = parseDownNestedDataDescription(data) as DataEntryArray;
  // adding the newly entered dataEntry to the start of the array, will always be found first
  const virginDataEntryArray = [correctedDataEntry, ...dataEntryArray];

  return updateDataEntryObject(versionParser.definition as DefinitionArrayObject, virginDataEntryArray);
};
