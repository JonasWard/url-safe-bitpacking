import { DataType } from '../enums/dataTypes';
export declare const IntegerMaxBits = 12;
export interface IntData {
    type: DataType.INT;
    min: number;
    max: number;
    bits: number;
}
