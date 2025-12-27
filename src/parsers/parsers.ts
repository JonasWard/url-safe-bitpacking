import { ConstantBitWidthDataTypes, HasStateBitsDataTypes } from '../enums/dataTypes';
import { DataEntry, SimpleDataEntry } from '../types/dataEntry';
import * as floatParser from './floatParser';
import * as intParser from './intParser';
import * as enumParser from './enumParser';
import * as versionParser from './versionParser';
import * as booleanParser from './booleanParser';
import * as enumArrayParser from './enumArrayParser.ts';
import * as arrayParser from './arrayParser';
import * as optionalParser from './optionalParser';
import * as enumOptionsParser from './enumOptionsParser.ts';
import * as objectParser from './objectParser';

export const getStateBitsCountForDataEntry = (entry: DataEntry): number => {
  if (ConstantBitWidthDataTypes.includes(entry.type as (typeof ConstantBitWidthDataTypes)[number])) return 0;
  return (entry as DataEntry & { type: (typeof HasStateBitsDataTypes)[number] }).stateBits;
};

export const getStateBitsForDataEntry = (
  entry: DataEntry & { type: (typeof HasStateBitsDataTypes)[number] }
): string => {
  switch (entry.type) {
    case 'ENUM_ARRAY':
      return enumArrayParser.rawStateStringifier(entry.value, entry.minCount, entry.stateBits);
    case 'OPTIONAL':
      return optionalParser.rawStateStringifier(entry.state);
    case 'ENUM_OPTIONS':
      return enumOptionsParser.rawStateStringifier(entry.state, entry.stateBits);
    case 'ARRAY':
      return arrayParser.rawStateStringifier(entry.state, entry.minCount, entry.stateBits);
  }
};

const simpleContentBitsCountForDataEntry = (entry: SimpleDataEntry): number => {
  switch (entry.type) {
    case 'BOOLEAN':
      return booleanParser.getBitsCount();
    case 'INT':
      return intParser.getBitsCount(entry);
    case 'ENUM':
      return enumParser.getBitsCount(entry);
    case 'FLOAT':
      return floatParser.getBitsCount(entry);
    case 'VERSION':
      return versionParser.getBitsCount(entry);
  }
};

/**
 * Helper method to get the bit-width for the content of a data entry (based on current value, doesn't do any validation)
 * @param entry - `DataEntry`
 */
export const getContentBitsCountForDataEntry = (entry: DataEntry): number => {
  switch (entry.type) {
    case 'BOOLEAN':
    case 'INT':
    case 'ENUM':
    case 'FLOAT':
    case 'VERSION':
      return simpleContentBitsCountForDataEntry(entry);
    case 'ENUM_ARRAY':
      return enumArrayParser.getContentBitsCountForValue(entry.value, entry);
    case 'ARRAY':
      return arrayParser.getContentBitsCountForValue(entry.value);
    case 'OPTIONAL':
      return optionalParser.getContentBitsCountForValue(entry.value);
    case 'ENUM_OPTIONS':
      return enumOptionsParser.getContentBitsCountForValue(entry.value);
    case 'OBJECT':
      return objectParser.getContentBitsCountForValue(entry.value);
  }
};

const helperSimpleParserWrapper = <T extends SimpleDataEntry>(entry: T, bitstring: string): [T, string] => [
  { ...entry, value: simpleFromValueParser(bitstring.slice(0, simpleContentBitsCountForDataEntry(entry)), entry) } as T,
  bitstring.slice(simpleContentBitsCountForDataEntry(entry))
];

const simpleFromValueParser = <T extends SimpleDataEntry>(bitString: string, entry: T): T['value'] => {
  switch (entry.type) {
    case 'BOOLEAN':
      return booleanParser.rawParser(bitString);
    case 'INT':
      return intParser.rawParser(bitString, entry);
    case 'ENUM':
      return enumParser.rawParser(bitString, entry);
    case 'FLOAT':
      return floatParser.rawParser(bitString, entry);
    case 'VERSION':
      return versionParser.rawParser(bitString, entry);
  }
};

export const dataEntryBitstringParser = <T extends DataEntry>(entry: T, bitString: string): [T, string] => {
  const result = _dataEntryBitstringParser(entry, bitString);
  // console.log(entry.type, entry.name, result[1]);
  return result;
};

/**
 * Method that parses a bitstring into a value
 *
 * @param bitString - `string` of 0 | 1
 * @param entry - `DataEntry` that represents the data entry to parse
 * @returns `number` | `boolean` that represents the parsed value
 */
const _dataEntryBitstringParser = <T extends DataEntry>(entry: T, bitString: string): [T, string] => {
  // console.log(entry.type, entry.name, bitString);
  switch (entry.type) {
    case 'BOOLEAN':
    case 'INT':
    case 'ENUM':
    case 'FLOAT':
    case 'VERSION':
      return helperSimpleParserWrapper(entry, bitString) as [T, string];
    case 'ENUM_ARRAY':
      return enumArrayParser.rawParser(entry, bitString) as [T, string];
    case 'ARRAY':
      return arrayParser.rawParser(entry, bitString) as [T, string];
    case 'OPTIONAL':
      return optionalParser.rawParser(entry, bitString) as [T, string];
    case 'ENUM_OPTIONS':
      return enumOptionsParser.rawParser(entry, bitString) as [T, string];
    case 'OBJECT':
      return objectParser.rawParser(entry, bitString) as [T, string];
  }
};

/**
 * Method that returns the amount of bits required for a given data entry
 * @param data - `DataEntry` that represents the data entry to get the bits count for
 * @param bitString - `string` 0 | 1
 * @returns `number` that represents the bits count for the given data entry
 */
export const getBitsCount = (mapData: SimpleDataEntry): number => {
  switch (mapData.type) {
    case 'BOOLEAN':
      return booleanParser.getBitsCount();
    case 'INT':
      return intParser.getBitsCount(mapData);
    case 'FLOAT':
      return floatParser.getBitsCount(mapData);
    case 'VERSION':
      return versionParser.getBitsCount(mapData);
    case 'ENUM':
      return enumParser.getBitsCount(mapData);
  }
};

/**
 * Get the bitstring for a given data entry
 * @param entry
 * @returns `0 | 1` string that represents the bitstate for the given object
 */
export const dataEntryBitsStringifier = (entry: DataEntry): string => {
  switch (entry.type) {
    case 'BOOLEAN':
      return booleanParser.rawStringifier(entry.value as boolean);
    case 'INT':
      return intParser.rawStringifier(entry.value as number, entry);
    case 'FLOAT':
      return floatParser.rawStringifier(entry.value as number, entry);
    case 'VERSION':
      return versionParser.rawStringifier(entry.value as number, entry);
    case 'ENUM':
      return enumParser.rawStringifier(entry.value as number, entry);
    case 'ENUM_ARRAY':
      return enumArrayParser.rawStringifier(entry.value as number[], entry);
    case 'ARRAY':
      return arrayParser.rawStringifier(entry);
    case 'OPTIONAL':
      return optionalParser.rawStringifier(entry);
    case 'ENUM_OPTIONS':
      return enumOptionsParser.rawStringifier(entry);
    case 'OBJECT':
      return objectParser.rawStringifier(entry);
  }
};

export const dataEntryCorrecting = (dataEntry: DataEntry): DataEntry =>
  dataEntryBitstringParser(dataEntry, dataEntryBitsStringifier(dataEntry))[0];
