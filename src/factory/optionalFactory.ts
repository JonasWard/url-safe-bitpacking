import { DataEntry, OptionalDataEntry } from '../types';
import { getCopy } from './copy';

export type OptionalFactory = (
  descriptor: [DataEntry, null] | [null, DataEntry],
  defaultState?: boolean,
  name?: string
) => OptionalDataEntry;

export const create: OptionalFactory = (descriptor, defaultState = false, name = 'an optional') => {
  if (descriptor[0] === null && descriptor[1] === null)
    throw new Error('descriptor must have at least one non-null value');
  if (descriptor[0] !== null && descriptor[1] !== null) throw new Error('descriptor must have only one non-null value');

  return {
    type: 'OPTIONAL',
    state: defaultState,
    descriptor,
    value: getCopy(defaultState ? descriptor[1] : descriptor[0]),
    name,
    stateBits: 1
  };
};
