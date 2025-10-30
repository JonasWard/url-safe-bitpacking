import { EnumArrayDataEntry } from '@/types';

export const updateValue = (original: EnumArrayDataEntry, update: EnumArrayDataEntry): EnumArrayDataEntry => {
  const value = update.value.map((v) => Math.max(Math.min(original.max, v), original.min));

  return {
    ...original,
    value
  };
};
