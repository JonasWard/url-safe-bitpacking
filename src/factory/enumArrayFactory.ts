import { DataType } from '@/enums';
import { EnumArrayDataEntry, IntegerMaxBits } from '@/types';

export const create = (
  value: number[],
  min: number = 0,
  max: number = 10,
  minCount: number = 1,
  maxCount: number = 10,
  name: string = '',
  index: number = -1
): EnumArrayDataEntry => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) throw new Error('min and max must be integers');
  if (!Number.isInteger(minCount) || !Number.isInteger(maxCount))
    throw new Error('minCount and maxCount must be integers');

  // are min and max in the proper order
  min = Math.min(min, max);
  max = Math.max(min, max);
  if (max - min < 1) throw new Error('range length must be at least one');
  if (Math.abs(max - min) > 2 ** IntegerMaxBits - 1) throw new Error('range length must be less than 1024');

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
    if (v < min || v > max)
      throw new Error(`all entries must be within the range ${min} - ${max}, index ${i} (${v}) is not`);
  });

  // are the values provided within the range of max and min count
  if (value.length < minCount || value.length > maxCount)
    throw new Error(
      `value length must be between minCount and maxCount, ${value.length} is not between ${minCount} and ${maxCount}`
    );

  return { type: DataType.ENUM_ARRAY, minCount, maxCount, value, min, max, name, index };
};
