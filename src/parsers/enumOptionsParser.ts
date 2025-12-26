import { rawValueParser as rawIntParser } from './parserUtils';
import { rawIntStringifier } from './parserUtils';
import { EnumOptionsDataEntry } from '../types';
import { dataEntryBitsStringifier, dataEntryBitstringParser, getContentBitsCountForDataEntry } from './parsers';

const getStateIndex = (enumOptionsData: EnumOptionsDataEntry, bitString: string): number => {
  if (enumOptionsData.stateBits === 0) return 0;
  return rawIntParser(bitString.slice(0, enumOptionsData.stateBits), enumOptionsData.stateBits);
};

export const rawParser = (enumOptionsData: EnumOptionsDataEntry, bitString: string): [EnumOptionsDataEntry, string] => {
  const state = getStateIndex(enumOptionsData, bitString);

  bitString = bitString.slice(enumOptionsData.stateBits);

  const [value, remainingBitstring] = enumOptionsData.descriptor[state]
    ? dataEntryBitstringParser(enumOptionsData.descriptor[state], bitString)
    : [null, bitString];

  return [{ ...enumOptionsData, value, state }, remainingBitstring];
};

export const rawStateStringifier = (
  state: EnumOptionsDataEntry['state'],
  stateBits: EnumOptionsDataEntry['stateBits']
): string => rawIntStringifier(state, stateBits);

export const rawStringifier = (enumOptionsData: EnumOptionsDataEntry): string =>
  rawStateStringifier(enumOptionsData.state, enumOptionsData.stateBits) +
  (enumOptionsData.value ? dataEntryBitsStringifier(enumOptionsData.value) : '');

export const getContentBitsCountForValue = (enumOptionsValue: EnumOptionsDataEntry['value']): number =>
  enumOptionsValue ? getContentBitsCountForDataEntry(enumOptionsValue) : 0;
