import { IntData } from '../types/intData';
export declare const getBitsCount: (intData: IntData) => number;
export declare const rawValueParser: (stateString: string, bitCount: number) => number;
export declare const rawParser: (stateString: string, intData: IntData) => number;
export declare const rawIntStringifier: (value: number, bitCount: number) => string;
export declare const rawStringifier: (value: number, intData: IntData) => string;
