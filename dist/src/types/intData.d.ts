import { DataType } from '../enums/dataTypes';
export type IntegerBitRangeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export interface IntData {
    type: DataType.INT;
    min: number;
    max: number;
    bits: IntegerBitRangeType;
}
//# sourceMappingURL=intData.d.ts.map