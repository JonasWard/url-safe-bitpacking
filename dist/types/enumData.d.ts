import { DataType } from '../enums/dataTypes';
export declare const EnumMaxBits = 8;
export type EnumData = {
    type: DataType.ENUM;
    value: number;
    max: number;
    bits: number;
};
