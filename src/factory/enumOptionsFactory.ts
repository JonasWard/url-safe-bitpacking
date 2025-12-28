import { EnumOptionsDataEntry, ObjectDataEntry } from '../types';
import { getCopy } from './copy';
import { getBitsForIntegerNumber, getMinimumBitsForInteger } from './helperMethod';
import { getEnumMaxAndMappingFromOptions } from './utils';

const maxEnumOptions = 64;
const maxEnumOptionsBits = getMinimumBitsForInteger(maxEnumOptions);

export type EnumOptionsFactory = (
  descriptor: (ObjectDataEntry | null)[],
  defaultState?: number,
  name?: string
) => EnumOptionsDataEntry;

export const create: EnumOptionsFactory = (descriptor, defaultState = 0, name = 'enum options') => {
  if (descriptor.length < 2) throw new Error('descriptor must have at least two entries');
  if (descriptor.length - 1 < defaultState)
    throw new Error('defaultState must be less than the length of the descriptor');
  if (descriptor.some((v) => v !== null && v.type !== 'OBJECT'))
    throw new Error('descriptors must be either ObjectDataEntry or null');

  // options are derived from the descriptor
  const { max, mapping } = getEnumMaxAndMappingFromOptions(descriptor.map((v, i) => (v ? v.name : i)));
  if (max !== descriptor.length - 1) throw new Error('max must be equal to the length of the descriptor - 1');

  return {
    value: getCopy(descriptor[defaultState] as ObjectDataEntry | null) as ObjectDataEntry | null,
    descriptor,
    name,
    mapping,
    type: 'ENUM_OPTIONS',
    stateBits: getBitsForIntegerNumber(descriptor.length, maxEnumOptionsBits),
    state: defaultState
  };
};
