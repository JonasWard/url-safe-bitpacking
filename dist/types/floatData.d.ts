import { DataType } from '../enums/dataTypes';
export type PrecisionRangeType = -3 | -2 | -1 | 0 | 1 | 2 | 3;
export declare const SignificandMaxBits = 20;
export interface FloatData {
    type: DataType.FLOAT;
    min: number;
    max: number;
    precision: PrecisionRangeType;
    significand: number;
}
