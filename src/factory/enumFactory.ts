import { EnumDataEntry } from '../types';
import { EnumMaxBits, EnumOptionsType } from '../types/enumData';
import { getBitsForIntegerNumber } from './helperMethod';
import { getEnumMaxAndMappingFromOptions } from './utils';

export type EnumFactory = (value: number, options: EnumOptionsType, name?: string) => EnumDataEntry;

export const create: EnumFactory = (value, options, name = 'an enum') => {
  const { max, mapping } = getEnumMaxAndMappingFromOptions(options);

  if (!Number.isInteger(max)) throw new Error(`max must be integers, you have given ${max}`);
  if (max < 1) throw new Error('max must be at least one');
  if (max > 2 ** EnumMaxBits - 1) throw new Error('max - min must be less than 256');
  const bits = getBitsForIntegerNumber(max + 1, EnumMaxBits);
  return { value, type: 'ENUM', max, bits, name, mapping };
};
