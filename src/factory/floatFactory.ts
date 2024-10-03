import { DataType } from '../enums/dataTypes';
import { FloatDataEntry } from '../types';
import { PrecisionRangeType, SignificandMaxBits } from '../types/floatData';
import { getBitsForIntegerNumber } from './helperMethod';

export const create = (
  value: number,
  min: number = 0,
  max: number = 1,
  precision: PrecisionRangeType = 2,
  name: string = '',
  index: number = 0
): FloatDataEntry => {
  const precisionMultiplier = 10 ** precision;

  const roundedMin = Math.floor(min * precisionMultiplier);
  const roundedMax = Math.ceil(max * precisionMultiplier);
  const delta = roundedMax - roundedMin;

  const significand = Math.max(1, getBitsForIntegerNumber(delta, SignificandMaxBits));

  return {
    value,
    type: DataType.FLOAT,
    min: roundedMin / precisionMultiplier,
    max: roundedMax / precisionMultiplier,
    precision,
    significand,
    name,
    index,
  };
};
