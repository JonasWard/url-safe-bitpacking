import { EnumOptionsDataEntry, NestedData } from '@/types';
import { updateNestedData } from './nestedDataMatching';

export const updateComplexValue = (
  original: EnumOptionsDataEntry,
  update: EnumOptionsDataEntry
): EnumOptionsDataEntry => {
  // if state of the update state range matches the allowed state range of the original, update the original
  if (update.state <= original.descriptor.length - 1) {
    original.value.length = 0; // retain the original array
    original.value.push(...updateNestedData(update.value, original.descriptor[update.state]));
    original.state = update.state;
  }

  return original;
};
