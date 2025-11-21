import { OptionalDataEntry, NestedData } from '@/types';
import { updateNestedData } from './nestedDataMatching';

export const updateComplexValue = (original: OptionalDataEntry, update: OptionalDataEntry): OptionalDataEntry => {
  if (update.descriptor[Number(original.state)] !== null && original.value !== null) {
    original.state = update.state;
    original.value.length = 0;
    original.value.push(...updateNestedData(update.value!, original.descriptor[Number(update.state)]!));
  }

  return original;
};
