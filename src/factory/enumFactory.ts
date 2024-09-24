import { DataType } from '../enums/dataTypes';
import { EnumMaxBits, EnumData } from '../types/enumData';
import { getBitsForIntegerNumber } from './helperMethod';

export const create = (max: number): EnumData => {
  if (!Number.isInteger(max)) throw new Error('min and max must be integers');
  if (max < 1) throw new Error('max must be at least one');
  if (max > 2 ** EnumMaxBits - 1) throw new Error('max - min must be less than 256');
  const bits = getBitsForIntegerNumber(max + 1, EnumMaxBits);
  return { type: DataType.ENUM, max, bits };
};
