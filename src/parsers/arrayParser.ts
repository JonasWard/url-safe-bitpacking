import { rawValueParser as rawIntParser, rawIntStringifier } from './intParser';
import { ArrayDataEntry, NestedData } from '@/types';
import { nestedDataBitstringParser, nestedDataStringifier } from './parsers';

const getCount = (arrayData: ArrayDataEntry, bitString: string): number => {
  if (arrayData.stateBits === 0) return arrayData.minCount;
  return rawIntParser(bitString.slice(0, arrayData.stateBits), arrayData.stateBits) + arrayData.minCount;
};

export const rawParser = (bitString: string, arrayData: ArrayDataEntry): [ArrayDataEntry, string] => {
  const state = getCount(arrayData, bitString);

  bitString = bitString.slice(arrayData.stateBits);

  const value: NestedData[] = [];
  for (let i = 0; i < state; i++) {
    const [nestedData, remainingBitstring] = nestedDataBitstringParser(bitString, arrayData.descriptor);
    value.push(nestedData);
    bitString = remainingBitstring;
  }

  return [{ ...arrayData, value, state }, bitString];
};

export const rawStateStringifier = (arrayData: ArrayDataEntry): string =>
  arrayData.stateBits ? rawIntStringifier(arrayData.value.length - arrayData.minCount, arrayData.stateBits) : '';

export const rawStringifier = (arrayData: ArrayDataEntry): string => {
  return rawStateStringifier(arrayData) + arrayData.value.map(nestedDataStringifier).join('');
};
