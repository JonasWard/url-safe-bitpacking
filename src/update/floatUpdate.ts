import { FloatDataEntry } from '../types/dataEntry';

export const updateValue = (original: FloatDataEntry, update: FloatDataEntry): FloatDataEntry => {
  const value = Math.max(Math.min(update.value, original.max), original.min);

  return {
    ...original,
    value,
  };
};
