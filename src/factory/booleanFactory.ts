import { BooleanDataEntry } from '../types';

export const create = (value: boolean, name: string = '', index: number = -1): BooleanDataEntry => ({
  value,
  type: 'BOOLEAN',
  name,
  index
});
