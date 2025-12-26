import { PrecisionRangeType } from '../types';

/**
 * Get the step for a given precision
 * @param precision - the precision range
 */
export const getStepForPrecision = (precision: PrecisionRangeType): number => 10 ** -precision;

/**
 * Constrain an unsigned int value to the given range
 * @param value - the value to constrains
 * @param maxValue - the maximum value (should be an integer)
 */
export const constrainUnsignedInt = (value: number, maxValue: number): number =>
  Math.max(0, Math.min(Math.round(value), maxValue));

/**
 * Constrain a signed int value to the given range
 * @param value - the value to constrain
 * @param minValue - the minimum value
 * @param maxValue - the maximum value
 */
export const constrainSignedInt = (value: number, minValue: number, maxValue: number): number =>
  constrainUnsignedInt(Math.round(value - minValue), Math.floor(maxValue - minValue)) + minValue;

/**
 * Constrain a float value to the given precision range
 * @param value - the value to constrain
 * @param minValue - the minimum value
 * @param maxValue - the maximum value
 * @param precision - the precision range
 */
export const constrainFloat = (
  value: number,
  minValue: number,
  maxValue: number,
  precision: PrecisionRangeType
): number => {
  const step = getStepForPrecision(precision);
  const multi = 1 / step;
  return constrainSignedInt(value * multi, minValue * multi, maxValue * multi) * step;
};
