import { ArrayDataEntry } from '@/types';
import { updateNestedData } from './nestedDataMatching';

export const updateComplexValue = (original: ArrayDataEntry, update: ArrayDataEntry): ArrayDataEntry => {
  // if state of the update is not within the acceptable range in the original, just return the original
  if (update.state >= original.minCount && update.state <= original.maxCount) {
    original.state = update.state;
    original.value.length = 0;
    for (let i = 0; i < original.state; i++)
      original.value.push(updateNestedData(update.value[i], original.descriptor));
  }

  return original;
};
