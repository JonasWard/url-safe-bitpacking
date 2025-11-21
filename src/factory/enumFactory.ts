import { EnumDataEntry } from '../types';
import { EnumMaxBits } from '../types/enumData';
import { getBitsForIntegerNumber } from './helperMethod';
import { getOptionsFromEnumOptions } from './utils';

export const create = (
  value: number,
  options: (string | number | object)[] | string | number,
  name: string = '',
  index: number = -1
): EnumDataEntry => {
  const { max, mapping } = getOptionsFromEnumOptions(options);

  if (!Number.isInteger(max)) throw new Error(`max must be integers, you have given ${max}`);
  if (max < 1) throw new Error('max must be at least one');
  if (max > 2 ** EnumMaxBits - 1) throw new Error('max - min must be less than 256');
  const bits = getBitsForIntegerNumber(max + 1, EnumMaxBits);
  return { value, type: 'ENUM', max, bits, name, index, mapping };
};
