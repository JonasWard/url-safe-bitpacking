import { DataType } from '../enums/dataTypes';

export type EnumBitRangeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// int max and int min can be any in javascript integer representable valid number
// however, the delta between the two should neve exceed 10 bits or 1024
export interface EnumData {
  type: DataType.ENUM;
  max: number;
  bits: EnumBitRangeType;
}
