import { DataType } from '../enums/dataTypes';
import { IntData, IntegerMaxBits } from '../types/intData';
import { getBitsForIntegerNumber } from './helperMethod';

export const create = (min: number, max: number): IntData => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('min and max must be integers');
  if (max - min < 1) throw new Error('max must be at least one');
  if (Math.abs(max - min) > 2 ** IntegerMaxBits - 1) throw new Error('max - min must be less than 1024');
  const bits = getBitsForIntegerNumber(max - min + 1, IntegerMaxBits);
  return { type: DataType.INT, min, max, bits };
};
