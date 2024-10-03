import { DataType } from '../enums/dataTypes';

export type VersionRangeType = 4 | 6 | 8 | 10;

export type VersionData = {
  type: DataType.VERSION;
  value: number;
  bits: VersionRangeType;
};
