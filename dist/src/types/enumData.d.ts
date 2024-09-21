import { DataType } from '../enums/dataTypes';
export type EnumBitRangeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export interface EnumData {
    type: DataType.ENUM;
    max: number;
    bits: EnumBitRangeType;
}
//# sourceMappingURL=enumData.d.ts.map