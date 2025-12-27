import { FloatDataEntry } from '../types';
import { PrecisionRangeType, SignificandMaxBits } from '../types/floatData';
import { validateFloat } from './utils';

export type FloatFactory = (
  value: number,
  min?: number,
  max?: number,
  precision?: PrecisionRangeType,
  name?: string
) => FloatDataEntry;

/**
 * Method to create a float data entry
 * @param value - `number` default value, should be between `min` and `max`
 * @param min - `number` (default: 0), should be smaller than `max`
 * @param max - `number` (default: 1), should be larger than `min`
 * @param precision - `PrecisionRangeType` (default: 2 -> .01),
 * @param name - `string`
 */
export const create: FloatFactory = (value, min = 0, max = 1, precision = 2, name = 'a float') => {
  const r = validateFloat(min, max, value, precision, name, 'FLOAT', SignificandMaxBits);
  return { value: r.value, type: 'FLOAT', min: r.min, max: r.max, precision, significand: r.bitwidth, name };
};
