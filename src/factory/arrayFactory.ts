import { ArrayDataEntry, DataEntry, IntegerMaxBits } from '../types';
import { getCopy } from './copy';
import { validateUnsignedInt } from './utils';

export type ArrayFactory = (
  descriptor: ArrayDataEntry['descriptor'],
  defaultState?: number,
  minCount?: number,
  maxCount?: number,
  name?: string
) => ArrayDataEntry;

export const create: ArrayFactory = (descriptor, defaultState = 0, minCount = 0, maxCount = 10, name = 'an array') => {
  const r = validateUnsignedInt(minCount, maxCount, defaultState, name, 'ARRAY', IntegerMaxBits);

  return {
    value: Array.from({ length: r.value }, () => getCopy(descriptor) as DataEntry),
    descriptor,
    type: 'ARRAY',
    minCount: r.min,
    maxCount: r.max,
    stateBits: r.bitwidth,
    state: r.value,
    name
  };
};
