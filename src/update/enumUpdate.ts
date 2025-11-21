import { EnumDataEntry } from '../types/dataEntry';

export const updateValue = (original: EnumDataEntry, update: EnumDataEntry): EnumDataEntry => {
  original.value = Math.min(original.max, update.value);
  return original;
};
