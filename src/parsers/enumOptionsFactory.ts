import { rawValueParser as rawIntParser, rawIntStringifier } from './intParser';
import { EnumOptionsDataEntry } from '@/types';
import { nestedDataBitstringParser, nestedDataStringifier } from './parsers';

const getStateIndex = (enumOptionsData: EnumOptionsDataEntry, bitString: string): number => {
  if (enumOptionsData.stateBits === 0) return 0;
  return rawIntParser(bitString.slice(0, enumOptionsData.stateBits), enumOptionsData.stateBits);
};

export const rawParser = (bitString: string, enumOptionsData: EnumOptionsDataEntry): [EnumOptionsDataEntry, string] => {
  const state = getStateIndex(enumOptionsData, bitString);

  bitString = bitString.slice(enumOptionsData.stateBits);

  const [value, remainingBitstring] = nestedDataBitstringParser(bitString, enumOptionsData.descriptor[state]);

  return [{ ...enumOptionsData, value, state }, remainingBitstring];
};

export const rawStateStringifier = (enumOptionsData: EnumOptionsDataEntry): string =>
  rawIntStringifier(enumOptionsData.state, enumOptionsData.stateBits);

export const rawStringifier = (enumOptionsData: EnumOptionsDataEntry): string =>
  rawStateStringifier(enumOptionsData) + nestedDataStringifier(enumOptionsData.value);
