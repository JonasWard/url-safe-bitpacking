// enum arrays are defined by a given base and a min and max count
// and a min and max integer value that can be stored
// from the min max integer count, the base for the enum array is derived

import { DataType } from '../enums/dataTypes';

export type EnumArrayData = {
  type: DataType.ENUM_ARRAY;
  minCount: number;
  maxCount: number;
  value: number[];
  min: number;
  max: number;
};
