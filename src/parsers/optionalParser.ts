import { OptionalDataEntry } from '../types';
import { dataEntryBitsStringifier, dataEntryBitstringParser, getContentBitsCountForDataEntry } from './parsers';

const getState = (bitString: string): number => Number(bitString.slice(0, 1));

export const rawParser = (optionalData: OptionalDataEntry, bitString: string): [OptionalDataEntry, string] => {
  const descriptorIndex = getState(bitString);

  bitString = bitString.slice(optionalData.stateBits);

  const [value, remainingBitstring] = optionalData.descriptor[descriptorIndex]
    ? dataEntryBitstringParser(optionalData.descriptor[descriptorIndex], bitString)
    : [null, bitString];
  const state = Boolean(descriptorIndex);

  return [{ ...optionalData, value, state }, remainingBitstring];
};

export const rawStateStringifier = (state: OptionalDataEntry['state']): string => (state ? '1' : '0');

export const rawStringifier = (optionalData: OptionalDataEntry): string =>
  optionalData.value === null
    ? rawStateStringifier(optionalData.state)
    : rawStateStringifier(optionalData.state) + dataEntryBitsStringifier(optionalData.value);

export const getContentBitsCountForValue = (optionalData: OptionalDataEntry['value']): number =>
  optionalData ? getContentBitsCountForDataEntry(optionalData) : 0;
