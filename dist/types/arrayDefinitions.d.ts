import { DataEntry, VersionDataEntry } from './dataEntry';
export type SingleLevelContentType = DataEntry | NestedContentDataType;
export type NestedContentDataType = [string, NestedContentType];
export type NestedContentType = SingleLevelContentType[] | DoubleLevelContentType;
export type DoubleLevelContentType = OptionalEntryDataType | EnumEntryDataType;
export type NonEmptyValidEntryArrayType = [SingleLevelContentType, ...SingleLevelContentType[]];
export type OptionalEntryDataType = [boolean, NonEmptyValidEntryArrayType, []] | [boolean, [], NonEmptyValidEntryArrayType];
export type EnumEntryDataType = [number, NonEmptyValidEntryArrayType, NonEmptyValidEntryArrayType, ...SingleLevelContentType[][]];
export type VersionArrayDefinitionType = [VersionDataEntry, ...SingleLevelContentType[]];
export declare const NAME_DELIMETER = "_";
