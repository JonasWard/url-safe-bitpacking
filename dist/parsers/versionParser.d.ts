import { VersionData } from '../types/versionData';
export declare const getBitsCount: (versionData: VersionData) => number;
export declare const rawParser: (rawString: string, versionData: VersionData) => number;
export declare const rawStringifier: (value: number, versionData: VersionData) => string;
