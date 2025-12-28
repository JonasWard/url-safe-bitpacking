import { DataEntry, ObjectDataEntry } from '../types';
import { getCopy } from './copy';

export type ObjectFactory = (descriptor: DataEntry[], name?: string) => ObjectDataEntry;

export const create: ObjectFactory = (descriptor, name = 'an object') => {
  return {
    type: 'OBJECT',
    descriptor,
    value: descriptor.map(getCopy) as DataEntry[],
    name
  };
};
