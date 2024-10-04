import { BooleanData } from './booleanData';
import { EnumData } from './enumData';
import { FloatData } from './floatData';
import { IntData } from './intData';
import { VersionData } from './versionData';
export type Prettify<T> = {
    [K in keyof T]: T[K];
};
type DataDescription = {
    name: string;
    internalName?: string;
    index: number;
};
export type BooleanDataEntry = Prettify<BooleanData & DataDescription>;
export type IntDataEntry = Prettify<IntData & DataDescription>;
export type EnumDataEntry = Prettify<EnumData & DataDescription>;
export type FloatDataEntry = Prettify<FloatData & DataDescription>;
export type VersionDataEntry = Prettify<VersionData & DataDescription>;
export type DataEntry = BooleanDataEntry | IntDataEntry | EnumDataEntry | FloatDataEntry | VersionDataEntry;
export type DataEntryArray = DataEntry[];
export {};
