import { BooleanDataEntry } from '../types';

export type BooleanFactory = (value: boolean, name?: string) => BooleanDataEntry;

export const create: BooleanFactory = (value, name = 'a boolean') => ({
  value,
  type: 'BOOLEAN',
  name
});
