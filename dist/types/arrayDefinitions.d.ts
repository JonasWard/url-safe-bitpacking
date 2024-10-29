import { DataEntry } from './dataEntry';
export type SingleLevelContentType = DataEntry | NestedContentDataType;
export type NestedContentDataType = [string, NestedContentType];
export type NestedContentType = SingleLevelContentType[] | DoubleLevelContentType;
export type DoubleLevelContentType = OptionalEntryDataType | EnumEntryDataType | ArrayEntryDataType;
export type NonEmptyValidEntryArrayType = [SingleLevelContentType, ...SingleLevelContentType[]];
export type OptionalEntryDataType = [boolean, NonEmptyValidEntryArrayType, []] | [boolean, [], NonEmptyValidEntryArrayType];
export type EnumEntryDataType = [number, NonEmptyValidEntryArrayType, NonEmptyValidEntryArrayType, ...SingleLevelContentType[][]];
export type ArrayEntryDataType = [[number, number], NonEmptyValidEntryArrayType];
export declare const PREFIX_SEPERATOR_DELIMETER = "_";
