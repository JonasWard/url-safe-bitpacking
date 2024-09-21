import { DataType } from '../enums/dataTypes';
export type PrecisionRangeType = -3 | -2 | -1 | 0 | 1 | 2 | 3;
export type SignificandBitsType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export interface FloatData {
    type: DataType.FLOAT;
    min: number;
    max: number;
    precision: PrecisionRangeType;
    significand: SignificandBitsType;
}
//# sourceMappingURL=floatData.d.ts.map