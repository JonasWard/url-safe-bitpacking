import { FloatDataEntry } from '../types';
import { PrecisionRangeType, SignificandMaxBits } from '../types/floatData';
import { getBitsForIntegerNumber } from './helperMethod';

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
  const precisionMultiplier = 10 ** precision;

  const roundedMin = Math.floor(min * precisionMultiplier);
  const roundedMax = Math.ceil(max * precisionMultiplier);
  const delta = roundedMax - roundedMin;

  const significand = Math.max(1, getBitsForIntegerNumber(delta, SignificandMaxBits));

  return {
    value,
    type: 'FLOAT',
    min: roundedMin / precisionMultiplier,
    max: roundedMax / precisionMultiplier,
    precision,
    significand,
    name
  };
};
