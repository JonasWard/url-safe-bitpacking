import { DataType } from '../enums/dataTypes';

export type VersionRangeType = 4 | 6 | 8 | 10;
export const VersionRange = [4, 6, 8, 10] as VersionRangeType[];

export type VersionData = {
  type: DataType.VERSION;
  value: number;
  bits: VersionRangeType;
};
