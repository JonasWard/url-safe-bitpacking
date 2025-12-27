import { DataEntry, ObjectDataEntry } from '../types';

export type ObjectFactory = (descriptor: DataEntry[], name?: string) => ObjectDataEntry;

export const create: ObjectFactory = (descriptor, name = 'an object') => {
  return {
    type: 'OBJECT',
    descriptor,
    value: descriptor,
    name
  };
};
