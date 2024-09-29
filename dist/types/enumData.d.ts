import { DataType } from '../enums/dataTypes';
export declare const EnumMaxBits = 8;
export interface EnumData {
    type: DataType.ENUM;
    max: number;
    bits: number;
}
