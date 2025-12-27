import { EnumArrayDataEntry, EnumMaxBits, EnumOptionsType, IntegerMaxBits } from '../types';
import { getEnumMaxAndMappingFromOptions, validateUnsignedInt } from './utils';
import { getBitsForIntegerNumber } from './helperMethod';

export type EnumArrayFactory = (
  value: number[],
  options: EnumOptionsType,
  minCount?: number,
  maxCount?: number,
  name?: string
) => EnumArrayDataEntry;

export const create: EnumArrayFactory = (value, options, minCount = 0, maxCount = 10, name = 'enum array') => {
  const { max, mapping } = getEnumMaxAndMappingFromOptions(options);
  const r = validateUnsignedInt(minCount, maxCount, value.length, name, 'ENUM_ARRAY', IntegerMaxBits);

  // are all the entries less than max
  value = Array.from(
    { length: r.value },
    (_, i) => validateUnsignedInt(0, max, value[i] ?? 0, `${name}[${i}]`, 'ENUM_ARRAY', EnumMaxBits).value
  );

  return { type: 'ENUM_ARRAY', minCount: r.min, maxCount: r.max, value, max, name, mapping, stateBits: r.bitwidth };
};
