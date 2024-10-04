import { ObjectGenerationOutputStatus } from '../enums/objectGenerationTypes';
import { DataEntryFactory } from '../factory/factory';
import {
  dataArrayStringifier,
  dataBitsArrayParser,
  dataBitsParser,
  dataBitsStringifier,
  getBitsCount,
  parseBase64ToBits,
  parseBitsToBase64,
} from '../parsers/parsers';
import { DataEntry, DataEntryArray, VersionDataEntry } from '../types/dataEntry';
import { SemanticlyNestedDataEntry } from '../types/semanticlyNestedDataEntry';
import { DefinitionArrayObject, ParsersForVersionObject } from '../types/versionParser';

// don't alter or change this variable anywher, it used when creating objects to keep track of the current index of a nested object
// it's a bit hacky, but it gets the job done...
let currentObjectIndex = -1;

/**
 * Method for finding the names of the variable data entries in the DefinitionArrayObject
 * @param definitionArrayObject - DefinitionArrayObject
 * @returns string[] - the key strings
 */
export const getVariableStrings = (definitionArrayObject: DefinitionArrayObject): string[] => {
  const keys: string[] = [];
  definitionArrayObject.forEach((value) => {
    if (Array.isArray(value)) {
      if (value.length === 2) keys.push(...getVariableStrings(value[1]));
      if (value.length === 3) keys.push(value[1].name);
    }
  });

  return keys;
};

/**
 * Method that translates a DefinitionArrayObject into a SemanticlyNestedDataEntry
 * @param definitionArrayObject [DataEntry | [string, DefinitionArrayObject]]
 * @returns
 */
export const nestedDataEntryArrayToObject = (definitionArrayObject: DefinitionArrayObject): SemanticlyNestedDataEntry => {
  currentObjectIndex = -1;
  return internalNestedDataEntryArrayToObject(definitionArrayObject);
};

const internalNestedDataEntryArrayToObject = (definitionArrayObject: DefinitionArrayObject): SemanticlyNestedDataEntry => {
  return Object.fromEntries(
    definitionArrayObject.map((value) => {
      if (Array.isArray(value)) {
        if (value.length === 2) return [value[0], internalNestedDataEntryArrayToObject(value[1])];
        else return [value[0], internalNestedDataEntryArrayToObject(value[2](value[1]))];
      }
      return [value.name, { ...value, index: ++currentObjectIndex }];
    })
  );
};

/**
 *
 * @param bitString bitstring
 * @param v key, DefinitionArrayObject pair
 * @param orderIndex
 * @returns
 */
const definitionArrayObjectParser = (
  bitString: string,
  v: [string, DefinitionArrayObject]
): [[string, SemanticlyNestedDataEntry], ObjectGenerationOutputStatus, number] => {
  const [key, values] = v;
  const [nestedSemanticObject, objectGenerationStatus, localEndIndex] = parsingDefinitionArrayObject(bitString, values);
  return [[key, nestedSemanticObject], objectGenerationStatus, localEndIndex];
};

const methodParser = (
  bitString: string,
  v: [string, DataEntry, (v: DataEntry) => DefinitionArrayObject]
): [[string, SemanticlyNestedDataEntry], ObjectGenerationOutputStatus, number] => {
  const [key, keyDataDescription, methodGenerator] = v;
  const [keyDataEntry, status] = dataEntryParser(bitString, keyDataDescription, false); // not increasing index twice
  const [result, localStatus, localEndIndex] = definitionArrayObjectParser(bitString, [key, methodGenerator(keyDataEntry)]);
  return [result, localStatus !== ObjectGenerationOutputStatus.PARSED ? localStatus : status, localEndIndex];
};

const dataEntryParser = (bitString: string, v: DataEntry, iterate: boolean = true): [DataEntry, ObjectGenerationOutputStatus, number] => {
  const bitWidth = getBitsCount(v);
  const value = iterate ? { ...dataBitsParser(bitString.slice(0, bitWidth), v), index: ++currentObjectIndex } : dataBitsParser(bitString.slice(0, bitWidth), v);
  return [value, ObjectGenerationOutputStatus.PARSED, bitWidth];
};

/**
 * Method to parse DataEntry & DefinitionArrayObjects
 * @param bitString bitstring
 * @param data: DefinitionArrayObject
 * @returns [The generated object, the generation status, the index end bit of the bit url (-1 if not used)]
 */
const parsingDefinitionArrayObject = (
  bitString: string,
  definitionArrayObject: DefinitionArrayObject
): [SemanticlyNestedDataEntry, ObjectGenerationOutputStatus, number] => {
  let startIndex = 0;
  let objectGenerationStatus = ObjectGenerationOutputStatus.PARSED;

  return [
    Object.fromEntries(
      definitionArrayObject.map((value) => {
        if (Array.isArray(value)) {
          if (value.length === 2) {
            const [[key, nestedSemanticObject], status, localEndIndex] = definitionArrayObjectParser(bitString.slice(startIndex), value);
            startIndex += localEndIndex;
            objectGenerationStatus !== ObjectGenerationOutputStatus.PARSED ? objectGenerationStatus : status;
            return [key, nestedSemanticObject];
          } else {
            const [[key, nestedSemanticObject], status, localEndIndex] = methodParser(bitString.slice(startIndex), value);
            startIndex += localEndIndex;
            objectGenerationStatus !== ObjectGenerationOutputStatus.PARSED ? objectGenerationStatus : status;
            return [key, nestedSemanticObject];
          }
        } else {
          const [dataEntry, status, localEndIndex] = dataEntryParser(bitString.slice(startIndex), value);
          startIndex += localEndIndex;
          objectGenerationStatus !== ObjectGenerationOutputStatus.PARSED ? objectGenerationStatus : status;
          return [dataEntry.name, dataEntry];
        }
      })
    ),
    objectGenerationStatus,
    startIndex,
  ];
};

/**
 * Method to parse a url into a SemanticlyNestedDataEntry.
 * @param url - the url to parse
 * @param parserVersions - the object containing the version parsers
 * @returns the parsed SemanticlyNestedDataEntry
 */
export const parseUrlMethod = (url: string, parserVersions: ParsersForVersionObject): SemanticlyNestedDataEntry => {
  currentObjectIndex = -1;

  const bitString = parseBase64ToBits(url);
  const version = dataBitsArrayParser(bitString, [DataEntryFactory.createVersion(0, parserVersions.versionBitCount)])[0] as VersionDataEntry;
  const versionParser = parserVersions.parsers[version.value];

  if (!versionParser) throw new Error(`No parser for version ${version.value}`);
  return parsingDefinitionArrayObject(bitString, versionParser.objectGeneratorParameters as DefinitionArrayObject)[0];
};

// flattening an nested data discription object, can be used for all semantically nested data types (though a bit type hacky)
export const parseDownNestedDataDescription = (nestedDataDescription: SemanticlyNestedDataEntry): DataEntry[] => {
  const dataDescriptions: DataEntry[] = [];
  Object.values(nestedDataDescription).forEach((value) => {
    if (value.hasOwnProperty('type')) dataDescriptions.push(value as DataEntry);
    else dataDescriptions.push(...parseDownNestedDataDescription(value as SemanticlyNestedDataEntry));
  });

  return dataDescriptions.sort();
};

/**
 * Method to get an URL descriptor from a SemanticlyNestedDataEntry
 * @param data: SemanticlyNestedDataEntry
 * @returns base64 string
 */
export const getURLForData = (data: SemanticlyNestedDataEntry): string => {
  const dataEntryArray = parseDownNestedDataDescription(data) as DataEntryArray;
  const bitstring = dataArrayStringifier(dataEntryArray);
  return parseBitsToBase64(bitstring);
};

// helper method to read out the bit data and see no weird mistakes were made anywhere
export const getTestStringValues = (
  data: SemanticlyNestedDataEntry
): {
  bitsString: string;
  base64BitString: string;
  base64SplitString: string;
  base64String: string;
  raw: string;
} => {
  const dataEntryArray = parseDownNestedDataDescription(data) as DataEntryArray;
  const bitstring = dataArrayStringifier(dataEntryArray);
  const url = parseBitsToBase64(bitstring);

  const dataValueStrings = dataEntryArray.map((dataEntry) => dataBitsStringifier(dataEntry));
  const singleString = dataValueStrings.join('');

  const base64bitStringArray = singleString.match(/.{1,6}/g)?.map((c) => c.padEnd(6, '0')) ?? [];
  const base64valueArray = url.split('').map((c) => c.padStart(6, '_'));

  const raw = JSON.stringify(parseDownNestedDataDescription(data), undefined, 1);

  return {
    bitsString: dataValueStrings.join('-'),
    base64BitString: base64bitStringArray.join('-'),
    base64SplitString: base64valueArray.join('-'),
    base64String: url,
    raw,
  };
};
