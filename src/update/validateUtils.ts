import { DataEntry, ComplexDataTypes, UpdateWithStateEntries, UpdateWithValuesEntries } from '../types';
import { updateStateEntry, updateValueEntry } from './updateValues';

/**
 * Method used as an interchange for validating data entries
 * @param descriptorValue - `DataEntry` - used as a mask for the state
 * @param differentValue - `DataEntry` - the one with the updated value and or state
 * @returns 
 */
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
        (differentValue as UpdateWithStateEntries).state,
        (differentValue as UpdateWithStateEntries).value
      ) as T;
    else
      return updateValueEntry(
        { ...(descriptorValue as UpdateWithValuesEntries) },
        (differentValue as UpdateWithValuesEntries).value
      ) as T;

  return descriptorValue;
};
