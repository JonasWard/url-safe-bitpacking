import { EnumOptionsDataEntry, NestedData } from '@/types';
import { getBitsForIntegerNumber, getMinimumBitsForInteger } from './helperMethod';

const maxEnumOptions = 64;
const maxEnumOptionsBits = getMinimumBitsForInteger(maxEnumOptions);

export const create = (
  descriptor: NestedData[],
  defaultState: number = 0,
  name: string = '',
  index: number = -1
): EnumOptionsDataEntry => {
  if (descriptor.length < 2) throw new Error('descriptor must have at least two entries');
  if (descriptor.length - 1 < defaultState)
    throw new Error('defaultState must be less than the length of the descriptor');

  return {
    value: descriptor[defaultState],
    descriptor,
    name,
    index,
    type: 'ENUM_OPTIONS',
    stateBits: getBitsForIntegerNumber(descriptor.length, maxEnumOptionsBits),
    state: defaultState
  };
};
