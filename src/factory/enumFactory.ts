import { EnumDataEntry } from '../types';
import { EnumMaxBits, EnumOptionsType } from '../types/enumData';
import { getBitsForIntegerNumber } from './helperMethod';
import { getEnumMaxAndMappingFromOptions, validateUnsignedInt } from './utils';

export type EnumFactory = (value: number, options: EnumOptionsType, name?: string) => EnumDataEntry;

export const create: EnumFactory = (value, options, name = 'an enum') => {
  const { max, mapping } = getEnumMaxAndMappingFromOptions(options);
  const r = validateUnsignedInt(0, max, value, name, 'ENUM', EnumMaxBits);
  return { value: r.value, type: 'ENUM', max: r.max, bits: r.bitwidth, name, mapping };
};
