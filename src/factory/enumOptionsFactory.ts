import { DataEntry, EnumMappingType, EnumOptionsDataEntry, EnumOptionsType } from '../types';
import { getBitsForIntegerNumber, getMinimumBitsForInteger } from './helperMethod';
import { getEnumMaxAndMappingFromOptions } from './utils';

const maxEnumOptions = 64;
const maxEnumOptionsBits = getMinimumBitsForInteger(maxEnumOptions);

export type EnumOptionsFactory = (
  descriptor: (DataEntry | null)[],
  defaultState?: number,
  name?: string,
  options?: EnumOptionsType
) => EnumOptionsDataEntry;

export const create: EnumOptionsFactory = (descriptor, defaultState = 0, name = 'enum options', options) => {
  if (descriptor.length < 2) throw new Error('descriptor must have at least two entries');
  if (descriptor.length - 1 < defaultState)
    throw new Error('defaultState must be less than the length of the descriptor');

  const mapping: EnumMappingType = [];

  if (options) {
    const { max, mapping } = getEnumMaxAndMappingFromOptions(options);
    if (max !== descriptor.length - 1) throw new Error('max must be equal to the length of the descriptor - 1');
    mapping.push(...mapping);
  } else mapping.push(...descriptor.map((_, i) => i));

  return {
    value: JSON.parse(JSON.stringify(descriptor[defaultState])),
    descriptor,
    name,
    mapping,
    type: 'ENUM_OPTIONS',
    stateBits: getBitsForIntegerNumber(descriptor.length, maxEnumOptionsBits),
    state: defaultState
  };
};
