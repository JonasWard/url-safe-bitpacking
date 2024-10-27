import { DataEntry, DefinitionArrayObject, DefinitionNestedArray, DefinitionDerivativeObject, DefinitionSubObject, ParsersForVersionObject } from '../types';
import { DerivativeStateDataType, StateDataType } from '../types/stateValueModel';

// don't alter or change this variable anywher, it used when creating objects to keep track of the current index of a nested object
// it's a bit hacky, but it gets the job done...
let currentDataEntryIndex = -1;

const parseDefinitionNestedArray = (nestedArray: DefinitionNestedArray): StateDataType => internalParseDefinitionArrayObject(nestedArray[1]);

const parseDefinitionNestedGenerationObject = (derivativeObject: DefinitionDerivativeObject): DerivativeStateDataType => {
  const output = derivativeObject[2](derivativeObject[1]);
  return {
    s: derivativeObject[1],
    v: isDefinitionArrayObjectArray(output.v)
      ? (output.v as `DefinitionArrayObject`[]).map(internalParseDefinitionArrayObject)
      : internalParseDefinitionArrayObject(output.v as DefinitionArrayObject),
  };
};

const parseDataEntry = (dataEntry: DataEntry): DataEntry => ({ ...dataEntry, index: ++currentDataEntryIndex });

const parseDefinitionSubObject = (subObject: DefinitionSubObject): [string, DataEntry] | [string, StateDataType] | [string, DerivativeStateDataType] => {
  if (Array.isArray(subObject))
    return subObject.length === 2 ? [subObject[0], parseDefinitionNestedArray(subObject)] : [subObject[0], parseDefinitionNestedGenerationObject(subObject)];
  return [subObject.name, parseDataEntry(subObject)];
};

/**
 * Internal method to read DefinitionArrayObject
 */
const internalParseDefinitionArrayObject = (definitionArrayObject: DefinitionArrayObject): StateDataType =>
  Object.fromEntries(definitionArrayObject.map(parseDefinitionSubObject));

/**
 * Method to read DefinitionArrayObject
 *
 */
export const parseDefinitionArrayObject = (definitionArrayObject: DefinitionArrayObject): StateDataType => {
  currentDataEntryIndex = -1;
  return internalParseDefinitionArrayObject(definitionArrayObject);
};

/**
 * Get the default object for a given version
 * @param versionParser - The parsers for all versions
 * @param versionindex - The index of the version for which to get the default object
 * @returns - The default object for the given version
 * @throws - Error if no parser for the given version index
 */
export const getDefaultObject = (versionParser: ParsersForVersionObject, versionindex: number): StateDataType => {
  if (!versionParser.parsers[versionindex]) throw new Error(`No parser for version ${versionindex} index`);
  return parseDefinitionArrayObject(versionParser.parsers[versionindex].definition);
};
