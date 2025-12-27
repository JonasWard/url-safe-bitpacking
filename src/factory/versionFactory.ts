import { VersionDataEntry } from '../types';
import { VersionRangeType } from '../types/versionData';

export type VersionFactory = (value: number, bits?: VersionRangeType, name?: string) => VersionDataEntry;

export const create: VersionFactory = (value, bits = 8, name = 'a version') => {
  if (!Number.isInteger(value)) value = Math.floor(value); // rounding value to an integer
  value = Math.max(0, Math.min(2 ** bits - 1, value)); // constraining value to the range of 0 and 2 ** bits - 1

  return {
    value,
    type: 'VERSION',
    bits,
    name
  };
};
