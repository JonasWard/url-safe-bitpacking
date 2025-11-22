import { EnumArrayDataEntry } from '@/types';

export const updateValue = (original: EnumArrayDataEntry, update: EnumArrayDataEntry): EnumArrayDataEntry => {
  const count = Math.max(Math.min(update.value.length, original.maxCount), original.minCount);
  original.value = [...new Array(count)].map((_, i) => Math.min(update.value[i] ?? 0, original.max));

  return original;
};
