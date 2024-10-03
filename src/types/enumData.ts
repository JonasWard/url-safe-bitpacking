import { DataType } from '../enums/dataTypes';

export const EnumMaxBits = 8;

// int max and int min can be any in javascript integer representable valid number
// however, the delta between the two should neve exceed 8 bits or 256
export type EnumData = {
  type: DataType.ENUM;
  value: number;
  max: number;
  bits: number;
};
