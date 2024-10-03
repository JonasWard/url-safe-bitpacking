import { IntDataEntry } from '../types/dataEntry';

export const updateValue = (original: IntDataEntry, update: IntDataEntry): IntDataEntry => {
  const value = Math.max(Math.min(update.value, original.max), original.min);

  return {
    ...original,
    value,
  };
};
