import { DataEntry } from '../types';
import { dataEntryBitsStringifier, dataEntryBitstringParser, getContentBitsCountForDataEntry } from './parsers';

/**
 * Helper method to get the bit count for a nested data entry
 * @param nestedData - `DataEntry[]` that represents the nested data entry
 * @returns
 */
export const getContentBitsCountForNestedData = (data: DataEntry[]): number =>
  data.map(getContentBitsCountForDataEntry).reduce((acc, curr) => acc + curr, 0);

export const nestedDataStringifier = (nestedData: DataEntry[]): string =>
  nestedData.map(dataEntryBitsStringifier).join('');

/**
 * Method that parses a bitstring for a given nested data descriptor
 * @param bitstring - `string` of 0 | 1
 * @param descriptor - `DataEntry[]` that represents the framework applicable to the bitstring
 */
export const nestedDataBitstringParser = (bitstring: string, descriptor: DataEntry[]): [DataEntry[], string] => {
  const resultingNestedData: DataEntry[] = descriptor.map((data) => {
    const [resultingData, remainingBitstring] = dataEntryBitstringParser(data, bitstring);
    bitstring = remainingBitstring;
    return resultingData;
  });

  return [resultingNestedData, bitstring];
};
