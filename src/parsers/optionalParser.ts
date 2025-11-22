import { OptionalDataEntry } from '@/types';
import { nestedDataBitstringParser, nestedDataStringifier } from './parsers';

const getState = (bitString: string): number => Number(bitString.slice(0, 1));

export const rawParser = (bitString: string, optionalData: OptionalDataEntry): [OptionalDataEntry, string] => {
  const descriptorIndex = getState(bitString);

  bitString = bitString.slice(1);

  const [value, remainingBitstring] = optionalData.descriptor[descriptorIndex]
    ? nestedDataBitstringParser(bitString, optionalData.descriptor[descriptorIndex])
    : [null, bitString];
  const state = Boolean(descriptorIndex);

  return [{ ...optionalData, value, state }, remainingBitstring];
};

export const rawStateStringifier = (optionalData: OptionalDataEntry): string => (optionalData.state ? '1' : '0');

export const rawStringifier = (optionalData: OptionalDataEntry): string =>
  optionalData.value === null
    ? rawStateStringifier(optionalData)
    : rawStateStringifier(optionalData) + nestedDataStringifier(optionalData.value);
