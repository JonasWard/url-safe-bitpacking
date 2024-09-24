import { DataType } from '../enums/dataTypes';
import { FloatData, PrecisionRangeType, SignificandMaxBits } from '../types/floatData';
import { getBitsForIntegerNumber } from './helperMethod';

export const create = (min: number, max: number, precision: PrecisionRangeType): FloatData => {
  const precisionMultiplier = 10 ** precision;

  const roundedMin = Math.floor(min * precisionMultiplier);
  const roundedMax = Math.ceil(max * precisionMultiplier);
  const delta = roundedMax - roundedMin;

  const significand = Math.max(1, getBitsForIntegerNumber(delta, SignificandMaxBits));

  return {
    type: DataType.FLOAT,
    min: roundedMin / precisionMultiplier,
    max: roundedMax / precisionMultiplier,
    precision,
    significand,
  };
};
