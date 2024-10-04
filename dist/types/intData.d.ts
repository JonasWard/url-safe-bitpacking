import { DataType } from '../enums/dataTypes';
export declare const IntegerMaxBits = 12;
export type IntData = {
    type: DataType.INT;
    value: number;
    min: number;
    max: number;
    bits: number;
};
