import { EnumArrayDataEntry } from '../types';
import { constrainUnsignedInt } from './updateUtils';

export const constrainValue = <T extends EnumArrayDataEntry>(original: T, update: T['value']): T['value'] => {
  const count = constrainUnsignedInt(update.length, original.maxCount);
  return [...new Array(count)].map((_, i) => constrainUnsignedInt(update[i] ?? 0, original.max));
};

export const updateValue = <T extends EnumArrayDataEntry>(original: T, update: T['value']): T => (
  (original.value = constrainValue(original, update)), original
);
