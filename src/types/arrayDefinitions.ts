import { DataEntry, VersionDataEntry } from './dataEntry';

// basic content type
export type SingleLevelContentType = DataEntry | NestedContentDataType;
// object-like key, attribute definition
export type NestedContentDataType = [string, NestedContentType];
export type NestedContentType = SingleLevelContentType[] | DoubleLevelContentType;
// actual content is only present in second nesting level of array
export type DoubleLevelContentType = OptionalEntryDataType | EnumEntryDataType;
export type NonEmptyValidEntryArrayType = [SingleLevelContentType, ...SingleLevelContentType[]];
export type OptionalEntryDataType = [boolean, NonEmptyValidEntryArrayType, []] | [boolean, [], NonEmptyValidEntryArrayType]; // first entry is the default value
export type EnumEntryDataType = [number, NonEmptyValidEntryArrayType, NonEmptyValidEntryArrayType, ...SingleLevelContentType[][]]; // first number is the default index

export type VersionArrayDefinitionType = [VersionDataEntry, ...SingleLevelContentType[]];

export const NAME_DELIMETER = '_';
