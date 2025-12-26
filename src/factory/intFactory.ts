import { IntDataEntry } from '../types';
import { IntegerMaxBits } from '../types/intData';
import { getBitsForIntegerNumber } from './helperMethod';

export type IntFactory = (value: number, min?: number, max?: number, name?: string) => IntDataEntry;

export const create: IntFactory = (value, min = 0, max = 10, name = 'an int') => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('min and max must be integers');
  if (max - min < 1) throw new Error('max must be at least one');
  if (Math.abs(max - min) > 2 ** IntegerMaxBits - 1) throw new Error('max - min must be less than 1024');
  const bits = getBitsForIntegerNumber(max - min + 1, IntegerMaxBits);
  return { value, type: 'INT', min, max, bits, name };
};
