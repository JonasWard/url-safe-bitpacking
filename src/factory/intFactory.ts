import { DataType } from '../enums/dataTypes';
import { IntDataEntry } from '../types';
import { IntegerMaxBits } from '../types/intData';
import { getBitsForIntegerNumber } from './helperMethod';

export const create = (value: number, min: number = 0, max: number = 10, name: string = '', index: number = 0): IntDataEntry => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('min and max must be integers');
  if (max - min < 1) throw new Error('max must be at least one');
  if (Math.abs(max - min) > 2 ** IntegerMaxBits - 1) throw new Error('max - min must be less than 1024');
  const bits = getBitsForIntegerNumber(max - min + 1, IntegerMaxBits);
  return { value, type: DataType.INT, min, max, bits, name, index };
};
