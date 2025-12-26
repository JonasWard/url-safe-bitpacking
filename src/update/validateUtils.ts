import { DataEntry, ComplexDataTypes, UpdateWithStateEntries, UpdateWithValuesEntries } from '../types';
import { updateStateEntry, updateValueEntry } from './updateValues';

// for now simple validation of values
export const validateDataEntry = <T extends DataEntry>(
  descriptorValue: T | null,
  differentValue: T | null
): T | null => {
  if (descriptorValue === null) return null;
  if (differentValue === null) return descriptorValue;
  if (descriptorValue.type === differentValue.type)
    if (ComplexDataTypes.includes(descriptorValue.type as (typeof ComplexDataTypes)[number]))
      return updateStateEntry(
        descriptorValue as UpdateWithStateEntries,
        (differentValue as UpdateWithStateEntries).state
      ) as T;
    else
      return updateValueEntry(
        descriptorValue as UpdateWithValuesEntries,
        (differentValue as UpdateWithValuesEntries).value
      ) as T;

  return descriptorValue;
};
