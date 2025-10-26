import { DataType } from '../enums/dataTypes';
import { DataEntryArray, DataEntry } from '../types/dataEntry';
import * as floatParser from './floatParser';
import * as intParser from './intParser';
import * as enumParser from './enumParser';
import * as versionParser from './versionParser';
import * as booleanParser from './booleanParser';
import * as enumArrayParser from './enumArrayParser.ts';

/**
 * Method that parses a bitstring into a value
 * @param bitString - `string` of 0 | 1
 * @param mapData - `DataEntry` that represents the data entry to parse
 * @returns `number` | `boolean` that represents the parsed value
 */
export const valueBitsParser = (bitString: string, mapData: DataEntry): number | boolean | number[] => {
  switch (mapData.type) {
    case DataType.BOOLEAN:
      return booleanParser.rawParser(bitString);
    case DataType.INT:
      return intParser.rawParser(bitString, mapData);
    case DataType.ENUM:
      return enumParser.rawParser(bitString, mapData);
    case DataType.FLOAT:
      return floatParser.rawParser(bitString, mapData);
    case DataType.VERSION:
      return versionParser.rawParser(bitString, mapData);
    case DataType.ENUM_ARRAY:
      return enumArrayParser.rawParser(bitString, mapData);
  }
};

/**
 * Method that parses a bitstring into a data entry
 * @param rawString - `string` of 0 | 1
 * @param mapData - `DataEntry` that represents the data entry to parse
 * @returns `DataEntry` that represents the parsed data entry
 */
export const dataBitsParser = (rawString: string, mapData: DataEntry): DataEntry => {
  switch (mapData.type) {
    case DataType.BOOLEAN:
      return { ...mapData, value: valueBitsParser(rawString, mapData) as boolean };
    case DataType.ENUM:
    case DataType.INT:
    case DataType.FLOAT:
    case DataType.VERSION:
      return { ...mapData, value: valueBitsParser(rawString, mapData) as number };
    case DataType.ENUM_ARRAY:
      return { ...mapData, value: valueBitsParser(rawString, mapData) as number[] };
  }
};

/**
 * Method that returns the amount of bits required for a given data entry
 * @param mapData - `DataEntry` that represents the data entry to get the bits count for
 * @param bitString - `string` 0 | 1
 * @returns `number` that represents the bits count for the given data entry
 */
export const getBitsCount = (mapData: DataEntry, bitString: string): number => {
  switch (mapData.type) {
    case DataType.BOOLEAN:
      return booleanParser.getBitsCount();
    case DataType.INT:
      return intParser.getBitsCount(mapData);
    case DataType.FLOAT:
      return floatParser.getBitsCount(mapData);
    case DataType.VERSION:
      return versionParser.getBitsCount(mapData);
    case DataType.ENUM:
      return enumParser.getBitsCount(mapData);
    case DataType.ENUM_ARRAY:
      return enumArrayParser.getBitsCount(mapData, bitString);
  }
};

/**
 * Method that parses a bitstring into a data entry and returns the remaining bitstring
 * @param bitstring - `string` of 0 | 1
 * @param dataEntry - `DataEntry` that represents the data entry to parse
 * @returns `[DataEntry, string]` that represents the data entry and the remaining bitstring
 */
export const dataEntryBitstringParser = (bitstring: string, dataEntry: DataEntry): [DataEntry, string] => [
  dataBitsParser(bitstring.slice(0, getBitsCount(dataEntry, bitstring)), dataEntry),
  bitstring.slice(getBitsCount(dataEntry, bitstring))
];

/**
 * Method to convert a bitstring into an array of data entries
 * @param bitString bitstring to parse into bits and then data entries
 * @param mapDataArray Data descriptions to map the bits to data entries
 * @returns array of data entries
 */
export const dataBitsArrayParser = (bitString: string, mapDataArray: DataEntryArray): DataEntryArray => {
  const dataEntries: DataEntryArray = [];
  let startIndex = 0;
  for (const dataEntry of mapDataArray) {
    const bitCount = getBitsCount(dataEntry, bitString);
    dataEntries.push(dataBitsParser(bitString.slice(startIndex, startIndex + bitCount), dataEntry));
  }
  return dataEntries;
};

export const dataBitsStringifier = (data: DataEntry): string => {
  switch (data.type) {
    case DataType.BOOLEAN:
      return booleanParser.rawStringifier(data.value as boolean);
    case DataType.INT:
      return intParser.rawStringifier(data.value as number, data);
    case DataType.FLOAT:
      return floatParser.rawStringifier(data.value as number, data);
    case DataType.VERSION:
      return versionParser.rawStringifier(data.value as number, data);
    case DataType.ENUM:
      return enumParser.rawStringifier(data.value as number, data);
    case DataType.ENUM_ARRAY:
      return enumArrayParser.rawStringifier(data.value as number[], data);
  }
};

export const dataEntryCorrecting = (dataEntry: DataEntry): DataEntry =>
  dataBitsParser(dataBitsStringifier(dataEntry), dataEntry);

export const base64url = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Method that returns the bits required for a given amount of numners for a specific base
 * @param count - `number` amount of numbers
 * @param base - `number` max value of the numbers
 */
export const getBitsForEnumArrayCountOfBase = (count: number, base: number): number =>
  Math.ceil(Math.log2(base) * count);

/**
 * Method to convert an array of numbers to a bit string
 * @param input - `number[]` the input array of numbers to convert to a bit string
 * @param fromBase - `number` that represents the base of the input numbers
 * @returns `string` that represents the bit string of the input numbers
 * @returns 0 | 1 bit string
 */
export const convertArbitraryBaseToBitString = (input: number[], fromBase: number): string => {
  const expectedOutputLength = getBitsForEnumArrayCountOfBase(input.length, fromBase);
  const fromBaseBigInt = BigInt(fromBase);

  let decimalValue = BigInt(0);
  for (let i = input.length - 1; i >= 0; i--) decimalValue = decimalValue * fromBaseBigInt + BigInt(input[i]);

  const s = decimalValue.toString(2).padStart(expectedOutputLength, '0');
  return s;
};

/**
 * Method to convert a bit string to an array of numbers of a specific base
 * @param input - `string` that represents the bit string to convert to an array of numbers
 * @param toBase - `number` that represents the base of the output numbers
 * @param expectedOutputLength - `number` that represents the expected length of the output array
 */
export const convertBitStringToArbitraryBase = (
  input: string,
  toBase: number,
  expectedOutputLength: number
): number[] => {
  let decimalValue = BigInt(`0b${input}`);
  const toBaseBigInt = BigInt(toBase);

  // Step 2: Convert to the target base
  const result: number[] = [];
  while (decimalValue > 0) {
    const remainder = decimalValue % toBaseBigInt;
    result.push(Number(remainder));
    decimalValue = decimalValue / toBaseBigInt;
  }

  if (expectedOutputLength !== undefined && result.length !== expectedOutputLength)
    for (let i = result.length; i < expectedOutputLength; i++) result.push(0);

  return result;
};

/**
 * Unused method to convert an array of numbers from an arbitrary base to an arbitrary base
 * @param input - `number[]` the input array of numbers to convert to a bit string
 * @param fromBase - `number` that represents the base of the input numbers
 * @param toBase - `number` that represents the base of the output numbers
 * @param expectedOutputLength - `number` | optional, should be given when you should find a specific amount of output numbers
 */
export const convertArbitraryBaseToArbitraryBase = (
  input: number[],
  fromBase: number,
  toBase: number,
  expectedOutputLength?: number
): number[] => {
  if (fromBase < 2 || fromBase > 64)
    throw new Error(`fromBase ${fromBase} is not supported. Supported bases are from 2 to 64`);
  if (toBase < 2 || toBase > 64)
    throw new Error(`fromBase ${toBase} is not supported. Supported bases are from 2 to 64`);

  expectedOutputLength =
    expectedOutputLength === undefined
      ? Math.ceil((Math.log2(fromBase) * input.length) / Math.log2(toBase))
      : expectedOutputLength;

  const fromBaseBigInt = BigInt(fromBase);
  const toBaseBigInt = BigInt(toBase);

  // Step 1: Convert input to decimal
  let decimalValue = BigInt(0);
  for (let i = input.length - 1; i >= 0; i--) decimalValue = decimalValue * fromBaseBigInt + BigInt(input[i]);

  // Step 2: Convert to the target base
  const result: number[] = [];
  while (decimalValue > 0) {
    const remainder = decimalValue % toBaseBigInt;
    result.push(Number(remainder));
    decimalValue = decimalValue / toBaseBigInt;
  }

  if (expectedOutputLength !== undefined && result.length !== expectedOutputLength)
    for (let i = result.length; i < expectedOutputLength; i++) result.push(0);

  return result;
};

/**
 * Method that convists a bitstring to a url safe base64 string
 * @param bits - `string` of 0 | 1
 * @returns `string` that represents the url safe base64 string
 */
export const parseBitsToBase64 = (bits: string): string => {
  // split the bits into 6 bit chunks
  const chunks = bits.match(/.{1,6}/g);
  // parse the chunks into numbers
  const numbers = chunks?.map((c) => Number.parseInt(c.padEnd(6, '0'), 2)) ?? [];
  // map the numbers to base64
  return numbers.map((n) => base64url.charAt(n)).join('');
};

/**
 * Method that convists a url safe base64 string to a bitstring
 * @param base64 - `string` that represents the url safe base64 string
 * @returns `string` of 0 | 1
 */
export const parseBase64ToBits = (base64: string): string => {
  // map the base64 characters to numbers
  const numbers = base64.split('').map((c) => base64url.indexOf(c));
  // parse the numbers into 6 bit chunks
  const chunks = numbers.map((n) => n.toString(2).padStart(6, '0'));
  // join the chunks
  return chunks.join('');
};

// *** only relevant exports for actual use ***

/**
 * Method to convert an array of data entries into a base64 string
 * @param dataArray Data Entries to read to parse into bits and then a base64 string
 * @returns bitstring representation of the data entries
 */
export const dataArrayStringifier = (dataEntryArray: DataEntryArray): string => {
  return dataEntryArray.map(dataBitsStringifier).join('');
};
