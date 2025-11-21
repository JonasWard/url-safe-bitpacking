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

export const rawStringifier = (optionalData: OptionalDataEntry): string => {
  const descriptorIndex = optionalData.state ? '1' : '0';

  if (optionalData.value === null) return descriptorIndex;
  return descriptorIndex + nestedDataStringifier(optionalData.value);
};
