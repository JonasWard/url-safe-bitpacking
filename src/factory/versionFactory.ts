import { VersionDataEntry } from '../types';
import { VersionRangeType } from '../types/versionData';

export const create = (
  value: number,
  bits: VersionRangeType = 8,
  name: string = '',
  index: number = -1
): VersionDataEntry => ({
  value,
  type: 'VERSION',
  bits,
  name,
  index
});
