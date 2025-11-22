import { EnumArrayDataEntry, IntegerMaxBits } from '@/types';
import { getOptionsFromEnumOptions } from './utils';

export const create = (
  value: number[],
  options: (string | number | object)[] | string | number,
  minCount: number = 1,
  maxCount: number = 10,
  name: string = '',
  index: number = -1
): EnumArrayDataEntry => {
  const { max, mapping } = getOptionsFromEnumOptions(options);

  if (!Number.isInteger(max)) throw new Error(`max must be integers, you have given ${max}`);
  if (!Number.isInteger(minCount) || !Number.isInteger(maxCount))
    throw new Error('minCount and maxCount must be integers');

  if (max < 1) throw new Error('must have at least two options');
  if (max > 2 ** IntegerMaxBits - 1)
    throw new Error(`maximum allowed options is 1024, you have given ${max + 1} options`);

  // are minCount and maxCount in the proper order
  minCount = Math.min(minCount, maxCount);
  maxCount = Math.max(minCount, maxCount);
  if (minCount < 1) throw new Error('minCount must be at least one');
  if (maxCount - minCount < 0)
    throw new Error(
      `count range length must be positive, given count range length is ${Math.abs(maxCount - minCount)}`
    );
  if (Math.abs(maxCount - minCount) > 2 ** IntegerMaxBits - 1)
    throw new Error(
      `count range length must be less than 1024, given count range length is ${Math.abs(maxCount - minCount)}`
    );

  // are all the entries in value
  value.forEach((v, i) => {
    if (!Number.isInteger(v)) throw new Error(`all entries must be integers, index ${i} (${v}) is not`);
    if (v > max) throw new Error(`all entries must be within the range ${0} - ${max}, index ${i} (${v}) is not`);
  });

  // are the values provided within the range of max and min count
  if (value.length < minCount || value.length > maxCount)
    throw new Error(
      `value length must be between minCount and maxCount, ${value.length} is not between ${minCount} and ${maxCount}`
    );

  return {
    type: 'ENUM_ARRAY',
    minCount,
    maxCount,
    value: JSON.parse(JSON.stringify(value)),
    max,
    name,
    index,
    mapping
  };
};
