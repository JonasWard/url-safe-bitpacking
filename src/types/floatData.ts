// floating points are interpreted as base 10 numbers
// either by the precision or from the min max range of a float, an exponent is derived
// from that, the radix is turned into an integer which, can have a maximum delta between min and max of 10000, stored as a 14 bit (technically it could be 16 384)
// the input component rounds accordingly!

import { DataType } from '../enums/dataTypes';

export type PrecisionRangeType = -3 | -2 | -1 | 0 | 1 | 2 | 3;
export const SignificandMaxBits = 20; // 1 million

export interface FloatData {
  type: DataType.FLOAT;
  min: number;
  max: number;
  precision: PrecisionRangeType;
  significand: number;
}
