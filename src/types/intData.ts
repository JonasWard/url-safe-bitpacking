import { DataType } from '../enums/dataTypes';

export const IntegerMaxBits = 12;

/**
 * Int object
 * 
 * Int objects are a simple integer value, starting at its min upto its max.
 * The maximum and minimum value can be any integar values represntabled as a double yet,
 * the maximum acceptable delta between min and max is `4095` (12 bits).
 */
export type IntData = {
  type: DataType.INT;
  value: number;
  min: number;
  max: number;
  bits: number;
};
