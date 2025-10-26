import { BooleanData } from './booleanData';
import { EnumData } from './enumData';
import { FloatData } from './floatData';
import { IntData } from './intData';
import { VersionData } from './versionData';
import { EnumArrayData } from './enumArrayData.ts';

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

type DataDescription = {
  name: string; // only used to make things more legible
  internalName?: string; // data entry name used internally
  index: number; // value doesn't need to be continuos
};

export type BooleanDataEntry = Prettify<BooleanData & DataDescription>;
export type IntDataEntry = Prettify<IntData & DataDescription>;
export type EnumDataEntry = Prettify<EnumData & DataDescription>;
export type FloatDataEntry = Prettify<FloatData & DataDescription>;
export type VersionDataEntry = Prettify<VersionData & DataDescription>;
export type EnumArrayDataEntry = Prettify<EnumArrayData & DataDescription>;

export type DataEntry =
  | BooleanDataEntry
  | IntDataEntry
  | EnumDataEntry
  | FloatDataEntry
  | VersionDataEntry
  | EnumArrayDataEntry;

export type ProtectedAttributeNames = Prettify<
  | keyof BooleanDataEntry
  | keyof IntDataEntry
  | keyof EnumDataEntry
  | keyof FloatDataEntry
  | keyof VersionDataEntry
  | keyof EnumArrayDataEntry
>;

export type DataEntryArray = DataEntry[];
