import { rawValueParser as rawIntParser } from './parserUtils';
import { rawIntStringifier } from './parserUtils';
import { ArrayDataEntry, DataEntry } from '../types';
import { getContentBitsCountForNestedData, nestedDataStringifier } from './parserNestedDataUtils';
import { dataEntryBitstringParser } from './parsers';

const getCount = (arrayData: ArrayDataEntry, bitString: string): number => {
  if (arrayData.stateBits === 0) return arrayData.minCount;
  return rawIntParser(bitString.slice(0, arrayData.stateBits), arrayData.stateBits) + arrayData.minCount;
};

export const rawParser = (arrayData: ArrayDataEntry, bitString: string): [ArrayDataEntry, string] => {
  const state = getCount(arrayData, bitString);

  bitString = bitString.slice(arrayData.stateBits);

  const value: DataEntry[] = [];

  // cant use nestedDataBitstringParser because the descriptor isn't a nested data type!
  for (let i = 0; i < state; i++) {
    const [entry, remainingBitstring] = dataEntryBitstringParser(arrayData.descriptor, bitString);
    value.push(entry);
    bitString = remainingBitstring;
  }

  return [{ ...arrayData, value, state }, bitString];
};

export const rawStateStringifier = (
  state: ArrayDataEntry['state'],
  minCount: ArrayDataEntry['minCount'],
  stateBits: ArrayDataEntry['stateBits']
): string => (stateBits ? rawIntStringifier(state - minCount, stateBits) : '');

export const rawStringifier = (arrayData: ArrayDataEntry): string => {
  return (
    rawStateStringifier(arrayData.state, arrayData.minCount, arrayData.stateBits) +
    nestedDataStringifier(arrayData.value)
  );
};

export const getContentBitsCountForValue = (arrayData: ArrayDataEntry['value']): number =>
  getContentBitsCountForNestedData(arrayData);
