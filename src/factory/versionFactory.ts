import { DataType } from '../enums/dataTypes';
import { VersionDataEntry } from '../types';
import { VersionRangeType, VersionData } from '../types/versionData';

export const create = (value: number, bits: VersionRangeType = 8, name: string = '', index: number = -1): VersionDataEntry => ({
  value,
  type: DataType.VERSION,
  bits,
  name,
  index,
});
