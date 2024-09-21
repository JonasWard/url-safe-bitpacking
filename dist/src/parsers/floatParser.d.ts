import { FloatData, PrecisionRangeType, SignificandBitsType } from '../types/floatData';
export declare const getBitsCount: (floatData: FloatData) => SignificandBitsType;
export declare const rawValueParser: (stateString: string, significandBits: SignificandBitsType, precision: PrecisionRangeType) => number;
export declare const rawParser: (stateString: string, floatData: FloatData) => number;
export declare const rawStringifier: (value: number, floatData: FloatData) => string;
//# sourceMappingURL=floatParser.d.ts.map