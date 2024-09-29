import { EnumData } from '../types/enumData';
export declare const getBitsCount: (versionData: EnumData) => number;
export declare const rawParser: (rawString: string, versionData: EnumData) => number;
export declare const rawStringifier: (value: number, versionData: EnumData) => string;
