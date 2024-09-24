import { DataType } from '../enums/dataTypes';

export const EnumMaxBits = 8;

// int max and int min can be any in javascript integer representable valid number
// however, the delta between the two should neve exceed 8 bits or 256
export interface EnumData {
  type: DataType.ENUM;
  max: number;
  bits: number;
}
