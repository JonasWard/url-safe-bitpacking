import { ArrayDataEntry } from '../types';
import { getMinimumBitsForInteger } from './helperMethod';

const maxArrayCount = 1024;

export type ArrayFactory = (
  descriptor: ArrayDataEntry['descriptor'],
  defaultState?: number,
  minCount?: number,
  maxCount?: number,
  name?: string
) => ArrayDataEntry;

export const create: ArrayFactory = (descriptor, defaultState = 0, minCount = 0, maxCount = 10, name = 'an array') => {
  if (!Number.isInteger(minCount) || !Number.isInteger(maxCount))
    throw new Error('minCount and maxCount must be integers');
  if (minCount < 0) throw new Error('minCount must be at least 0');
  if (maxCount < 0) throw new Error('maxCount must be at least 0');
  if (maxCount - minCount < 0) throw new Error('maxCount must be greater than or equal to minCount');
  if (maxCount - minCount > maxArrayCount)
    throw new Error(
      `maxCount (${maxCount}) - minCount (${minCount}) = ${
        maxCount - minCount
      } must be less than or equal to maxArrayCount (${maxArrayCount})`
    );
  if (defaultState < minCount || defaultState > maxCount)
    throw new Error(
      `defaultState must be between minCount (${minCount}) and maxCount (${maxCount}), given defaultState is ${defaultState}`
    );

  const stateBits = getMinimumBitsForInteger(maxCount - minCount);

  return {
    value: [...Array(defaultState)].map(() => JSON.parse(JSON.stringify(descriptor))),
    descriptor,
    type: 'ARRAY',
    minCount,
    maxCount,
    stateBits,
    state: defaultState,
    name
  };
};
