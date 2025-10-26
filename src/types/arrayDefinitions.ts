import { DataEntry } from './dataEntry';

/**
 * Nested Content Type
 * content type that does nothing more than provide a name to an entry so that the data can be read from a key-value pair object
 */
export type NestedContentDataType = [string, NestedContentType];

/**
 * Single Level Content Type
 * data that can be behind a string in an object definition
 */
export type SingleLevelContentType = DataEntry | NestedContentDataType;

/**
 * Content Type Union
 */
export type NestedContentType = SingleLevelContentType[] | DoubleLevelContentType;

/**
 * Double Level Content Type
 * is a data model array definition for which the first entry describes relevant data for the datamodel content type, but data model definition in of itself
 * 
 * this additional state data is represented in the object model with a boolean for the OptionalEntryDataType, an Enum for the EnumEntryDataType and an array for the ArrayEntryDataType+++++++++
 */
export type DoubleLevelContentType = OptionalEntryDataType | EnumEntryDataType | ArrayEntryDataType;

/**
 * Non Empty Valid Entry Array Type
 * is a data model array definition that is not empty
 */
export type NonEmptyValidEntryArrayType = [SingleLevelContentType, ...SingleLevelContentType[]];

/**
 * Optional Entry
 * An optional entry is where the user can choose between two data model options
 * 
 * the first value of the array is whether the user by default chooses the first option or the second option
 * 
 * the two options should always be present!
 */
export type OptionalEntryDataType = [boolean, NonEmptyValidEntryArrayType, []] | [boolean, [], NonEmptyValidEntryArrayType]; // first entry is the default value

/**
 * Enum Entry
 * An enum defintion is where the user is offered a list of optional data models to choose from
 * 
 * the first value of the arrea the default option available
 * all the other values are the option definitions
 * 
 * the first value can't be bigger than the amount of options defined
 * there should be at least two options given!
 */
export type EnumEntryDataType = [number, NonEmptyValidEntryArrayType, NonEmptyValidEntryArrayType, ...SingleLevelContentType[][]]; // first number is the default index

/**
 * Array Entry
 * An array definition is where the user is offered a list data models
 * 
 * the first value of the array is the min and max count of the array
 * the second value is the data model that is expected
 * 
 * the delta of min and max count can't be less than 1 (and larger than 1024)
 */
export type ArrayEntryDataType = [[number, number], NonEmptyValidEntryArrayType];

export const PREFIX_SEPERATOR_DELIMETER = '_';
