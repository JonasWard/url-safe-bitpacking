import { FloatDataEntry } from '../types/dataEntry';

export const updateValue = (original: FloatDataEntry, update: FloatDataEntry): FloatDataEntry => {
  original.value = Math.max(Math.min(update.value, original.max), original.min);
  return original;
};
