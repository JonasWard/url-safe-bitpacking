import { dataEntryCorrecting } from '../parsers';
import {
  DataEntry,
  DataEntryArray,
  DefinitionArrayObject,
  DefinitionDerivativeObject,
  DefinitionNestedArray,
  DefinitionSubObject,
  ParsersForVersionObject,
  VersionDataEntry,
} from '../types';
import { DerivativeStateDataType, StateDataType } from '../types/stateValueModel';
import { updateValue } from '../update';
import { getDataEntryArray } from './stateValueHelperMethods';

// don't alter or change this variable anywher, it used when creating objects to keep track of the current index of a nested object
// it's a bit hacky, but it gets the job done...
let currentDataEntryIndex = -1;

/**
 * Helper method for finding an existing data entry in case there was a previous object
 * @param dataEntry - new DataEntry
 * @param dataEntryArray - existing DataEntryArray
 */
const findExistingDataEntry = (dataEntry: DataEntry, dataEntryArray: DataEntryArray): DataEntry | undefined =>
  dataEntryArray.find((d) => (d.internalName ?? d.name) === (dataEntry.internalName ?? dataEntry.name));

const updateDefinitionNestedArray = (nestedArray: DefinitionNestedArray, existingData: DataEntryArray): StateDataType =>
  internalUpdateDefinitionArrayObject(nestedArray[1], existingData);

const updateDefinitionNestedGenerationObject = (derivativeObject: DefinitionDerivativeObject, existingData: DataEntryArray): DerivativeStateDataType => {
  const output = derivativeObject[2](updateDataEntry(derivativeObject[1], existingData));
  return {
    s: updateDataEntry(derivativeObject[1], existingData),
    v: internalUpdateDefinitionArrayObject(derivativeObject[2](derivativeObject[1]), existingData),
  };
};

const updateDataEntry = (dataEntry: DataEntry, existingData: DataEntryArray): DataEntry => {
  const existingDataEntry = findExistingDataEntry(dataEntry, existingData);
  return { ...(existingDataEntry ? updateValue(dataEntry, existingDataEntry) : dataEntry), index: currentDataEntryIndex++ };
};

const updateDefinitionSubObject = (
  subObject: DefinitionSubObject,
  existingData: DataEntryArray
): [string, DataEntry] | [string, StateDataType] | [string, DerivativeStateDataType] => {
  if (Array.isArray(subObject))
    return subObject.length === 2
      ? [subObject[0], updateDefinitionNestedArray(subObject, existingData)]
      : [subObject[0], updateDefinitionNestedGenerationObject(subObject, existingData)];
  return [subObject.name, updateDataEntry(subObject, existingData)];
};

/**
 * Internal method to read read DefinitionArrayObject
 */
const internalUpdateDefinitionArrayObject = (definitionArrayObject: DefinitionArrayObject, existingData: DataEntryArray): StateDataType =>
  Object.fromEntries(definitionArrayObject.map((v) => updateDefinitionSubObject(v, existingData)));

/**
 * Method that handles the updating of a single value in a SemanticlyNestedDataEntry object
 * @param data SemanticlyNestedDataEntry
 * @param newDataEntry updated DataEntry
 * @param parsersForVersion version object
 * @returns a newly created object in case of a key data description, otherwise the same object with just the new Data Entry value updated
 */
export const updateStateData = (data: StateDataType, newDataEntry: DataEntry, versionParser: ParsersForVersionObject): StateDataType => {
  currentDataEntryIndex = -1; // version for some reason is not correctly indexed, but that is acceptable

  const version = data.version as VersionDataEntry;
  const parser = versionParser.parsers[version.value];
  if (!parser) throw new Error(`No parser for version ${version.value}`);

  const correctedDataEntry = dataEntryCorrecting(newDataEntry);

  // create a new virgin object but replace the keyDataDescription with the new value
  const dataEntryArray = getDataEntryArray(data);
  // adding the newly entered dataEntry to the start of the array, will always be found first
  const virginDataEntryArray = [correctedDataEntry, ...dataEntryArray];

  return internalUpdateDefinitionArrayObject(parser.definition, virginDataEntryArray);
};
