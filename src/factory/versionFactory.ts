import { VersionDataEntry } from '../types';
import { VersionRangeType } from '../types/versionData';

export type VersionFactory = (value: number, bits?: VersionRangeType, name?: string) => VersionDataEntry;

export const create: VersionFactory = (value, bits = 8, name = 'a version') => ({
  value,
  type: 'VERSION',
  bits,
  name
});
