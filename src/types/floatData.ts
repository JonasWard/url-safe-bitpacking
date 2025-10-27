import { DataType } from '../enums/dataTypes';

export type PrecisionRangeType = -3 | -2 | -1 | 0 | 1 | 2 | 3;
export const SignificandMaxBits = 20; // 1 million

/**
 * Float object
 *
 * Float objects are a fixed point extension of the int object, with a larger available precision range.
 * Dispite a `min` and a `max` value, they also have a `precision` and a `significand` attribute.
 * The precision defines where the point is located and can be an integer value between -3 and 3 (-3 meaning **divided** by 1e-3 -> multiplied by 1000, 3 meaning **divided** by 1e3 -> multiplied by 1e-3 -> multiplied by .001)
 * The significand defines the amount of bits that are used to store the numeric value of the number and is derived from the `min` and `max` values in relationship to the precision.
 * Maximum value for the significand is `20` bits, which allows for a maximum of 1048576 possible values.
 */
export type FloatData = {
  type: DataType.FLOAT;
  value: number;
  min: number;
  max: number;
  precision: PrecisionRangeType;
  significand: number;
};
