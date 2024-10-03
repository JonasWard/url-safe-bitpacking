import { BooleanDataEntry } from '../types/dataEntry';

export const updateValue = (original: BooleanDataEntry, update: BooleanDataEntry): BooleanDataEntry => ({
  ...original,
  value: update.value,
});
