import { DataType } from '../enums/dataTypes';

export const EnumMaxBits = 8;

/**
 * Enum object
 * 
 * An enum object is a continious range of integer values, starting at 0 upto its max.
 * The maximum acceptable value for the max is `255` (8 bits)
 */
export type EnumData = {
  type: DataType.ENUM;
  value: number;
  max: number;
  bits: number;
};
