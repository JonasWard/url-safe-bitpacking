import { NestedData, OptionalDataEntry } from '@/types';

export const create = (
  descriptor: [null, NestedData] | [NestedData, null],
  defaultState: boolean = false,
  name: string = '',
  index: number = -1
): OptionalDataEntry => {
  if (descriptor[0] === null && descriptor[1] === null)
    throw new Error('descriptor must have at least one non-null value');
  if (descriptor[0] !== null && descriptor[1] !== null) throw new Error('descriptor must have only one non-null value');

  return {
    type: 'OPTIONAL',
    state: defaultState,
    descriptor,
    value: defaultState ? descriptor[0] : descriptor[1],
    name,
    index
  };
};
