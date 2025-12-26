import { IntData } from '../types/intData';
import { rawIntStringifier, rawValueParser } from './parserUtils';

export const getBitsCount = (intData: IntData): number => intData.bits;

/**
 * Method that parses a state bitstring into a raw positive int
 * @param stateString - `string` 0 | 1
 * @param intData - `IntData` that represents the int data entry to parse
 * @returns `number` that represents the parsed value
 */
export const rawParser = (stateString: string, intData: IntData): number => {
  const v = rawValueParser(stateString, intData.bits) + intData.min;
  if (v > intData.max) throw new Error('Value exceeds max');
  return v;
};

export const rawStringifier = (value: number, intData: IntData): string => {
  if (value < intData.min) throw new Error('Value is below min');
  if (value > intData.max) throw new Error('Value exceeds max');
  return rawIntStringifier(value - intData.min, intData.bits);
};
