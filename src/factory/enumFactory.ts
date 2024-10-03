import { DataType } from '../enums/dataTypes';
import { EnumDataEntry } from '../types';
import { EnumMaxBits } from '../types/enumData';
import { getBitsForIntegerNumber } from './helperMethod';

export const create = (value: number, max: number = 10, name: string = '', index: number = 0): EnumDataEntry => {
  if (!Number.isInteger(max)) throw new Error('min and max must be integers');
  if (max < 1) throw new Error('max must be at least one');
  if (max > 2 ** EnumMaxBits - 1) throw new Error('max - min must be less than 256');
  const bits = getBitsForIntegerNumber(max + 1, EnumMaxBits);
  return { value, type: DataType.ENUM, max, bits, name, index };
};
