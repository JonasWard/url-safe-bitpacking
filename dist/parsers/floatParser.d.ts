import { FloatData, PrecisionRangeType } from '../types/floatData';
export declare const getBitsCount: (floatData: FloatData) => number;
export declare const rawValueParser: (stateString: string, significandBits: number, precision: PrecisionRangeType) => number;
export declare const rawParser: (stateString: string, floatData: FloatData) => number;
export declare const rawStringifier: (value: number, floatData: FloatData) => string;
