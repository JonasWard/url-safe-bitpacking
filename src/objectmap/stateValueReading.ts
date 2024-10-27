import { DataEntryFactory } from '../factory';
import { dataEntryBitstringParser, parseBase64ToBits } from '../parsers';
import { DataEntry, DefinitionArrayObject, DefinitionDerivativeObject, DefinitionNestedArray, DefinitionSubObject, ParsersForVersionObject } from '../types';
import { DerivativeStateDataType, StateDataType } from '../types/stateValueModel';

// don't alter or change this variable anywher, it used when creating objects to keep track of the current index of a nested object
// it's a bit hacky, but it gets the job done...
let currentDataEntryIndex = -1;

const readDefinitionNestedArray = (nestedArray: DefinitionNestedArray, bitString: string): [StateDataType, string] =>
  internalReadDefinitionArrayObject(nestedArray[1], bitString);

const updateDefinitionNestedGenerationObject = (derivativeObject: DefinitionDerivativeObject, bitString: string): [DerivativeStateDataType, string] => {
  const [s, bitStringState] = readDataEntry(derivativeObject[1], bitString);
  const [v, bitStringValue] = internalReadDefinitionArrayObject(derivativeObject[2](s), bitStringState);
  return [
    {
      s,
      v,
    },
    bitStringValue,
  ];
};

const readDataEntry = (dataEntry: DataEntry, bitString: string): [DataEntry, string] => {
  const [d, slicedBitstring] = dataEntryBitstringParser(bitString, dataEntry);
  return [{ ...d, index: currentDataEntryIndex++ }, slicedBitstring];
};

const readDefinitionSubObject = (
  subObject: DefinitionSubObject,
  bitString: string
): [string, [DataEntry, string]] | [string, [StateDataType, string]] | [string, [DerivativeStateDataType, string]] => {
  if (Array.isArray(subObject))
    return subObject.length === 2
      ? [subObject[0], readDefinitionNestedArray(subObject, bitString)]
      : [subObject[0], updateDefinitionNestedGenerationObject(subObject, bitString)];
  return [subObject.name, readDataEntry(subObject, bitString)];
};

/**
 * Internal method to read read DefinitionArrayObject
 */
const internalReadDefinitionArrayObject = (definitionArrayObject: DefinitionArrayObject, bitString: string): [StateDataType, string] => {
  let localBitstring = bitString;
  const stateData = Object.fromEntries(
    definitionArrayObject.map((v) => {
      const [attributeName, [value, newBitstring]] = readDefinitionSubObject(v, localBitstring);
      localBitstring = newBitstring;
      return [attributeName, value];
    })
  );
  return [stateData, localBitstring];
};

/**
 * Method that handles the updating of a single value in a SemanticlyNestedDataEntry object
 * @param data SemanticlyNestedDataEntry
 * @param newDataEntry updated DataEntry
 * @param parsersForVersion version object
 * @returns a newly created object in case of a key data description, otherwise the same object with just the new Data Entry value updated
 */
export const readStateData = (base64String: string, parserVersions: ParsersForVersionObject): StateDataType => {
  currentDataEntryIndex = -1; // version for some reason is not correctly indexed, but that is acceptable

  const bitString = parseBase64ToBits(base64String);
  const [version] = dataEntryBitstringParser(bitString, DataEntryFactory.createVersion(0, parserVersions.versionBitCount));
  const versionParser = parserVersions.parsers[version.value as number];
  if (!versionParser) throw new Error(`No parser for version ${version.value}`);

  return internalReadDefinitionArrayObject(versionParser.definition, bitString)[0];
};
