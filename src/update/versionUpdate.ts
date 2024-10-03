import { VersionDataEntry } from '../types/dataEntry';

export const updateValue = (original: VersionDataEntry, update: VersionDataEntry): VersionDataEntry => {
  const value = Math.min(original.bits ** 2 - 1, update.value);

  return {
    ...original,
    value,
  };
};
