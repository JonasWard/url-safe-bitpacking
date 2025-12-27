import { IntDataEntry } from '../types';
import { IntegerMaxBits } from '../types/intData';
import { validateSignedInt } from './utils';

export type IntFactory = (value: number, min?: number, max?: number, name?: string) => IntDataEntry;

/**
 * Method to create an int data entry
 * @param value - `number` default value, should be between `min` and `max`
 * @param min - `number` (default: 0), should be smaller than `max`
 * @param max - `number` (default: 10), should be larger than `min` will be swapped if `min` is larger, the delta between min and max should not be greater than 1023 (max value representable in 10 bits)
 * @param name - `string`
 */
export const create: IntFactory = (value, min = 0, max = 10, name = 'an int') => {
  const r = validateSignedInt(min, max, value, name, 'INT', IntegerMaxBits);
  return { value, type: 'INT', min: r.min, max: r.max, bits: r.bitwidth, name };
};
