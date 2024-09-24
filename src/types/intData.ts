import { DataType } from '../enums/dataTypes';

export const IntegerMaxBits = 12;

// int max and int min can be any in javascript integer representable valid number
// however, the delta between the two should neve exceed 12 bits or 4096
export interface IntData {
  type: DataType.INT;
  min: number;
  max: number;
  bits: number;
}
