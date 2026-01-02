import { DataEntry, ObjectDataEntry } from '../types';
import { validateDataEntry } from './validateUtils';

export const updateValue = (original: ObjectDataEntry, value: ObjectDataEntry['value']): ObjectDataEntry => ({
  ...original,
  value: original.descriptor.map((v, i) => validateDataEntry(v, value[i] ?? null) as DataEntry)
});