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

/**
 * Boolean object
 * 
 * Boolean objects are a simple `true` or `false`, 1 or 0 - one bitwidth object.
 */
export type BooleanDataEntry = Prettify<BooleanData & DataDescription>;

/**
 * Enum object
 * 
 * An enum object is a continious range of integer values, starting at 0 upto its max.
 * The maximum acceptable value for the max is `255` (8 bits)
 */
export type EnumDataEntry = Prettify<EnumData & DataDescription>;

/**
 * Int object
 * 
 * Int objects are a simple integer value, starting at its min upto its max.
 * The maximum and minimum value can be any integar values represntabled as a double yet,
 * the maximum acceptable delta between min and max is `4095` (12 bits).
 */
export type IntDataEntry = Prettify<IntData & DataDescription>;

/**
 * Float object
 *
 * Float objects are a fixed point extension of the int object, with a larger available precision range.
 * Dispite a `min` and a `max` value, they also have a `precision` and a `significand` attribute.
 * The precision defines where the point is located and can be an integer value between -3 and 3 (-3 meaning **divided** by 1e-3 -> multiplied by 1000, 3 meaning **divided** by 1e3 -> multiplied by 1e-3 -> multiplied by .001)
 * The significand defines the amount of bits that are used to store the numeric value of the number and is derived from the `min` and `max` values in relationship to the precision.
 * Maximum value for the significand is `20` bits, which allows for a maximum of 1048576 possible values.
 */
export type FloatDataEntry = Prettify<FloatData & DataDescription>;

/**
 * Version object
 * 
 * Version objects are a special type of the enum object, which have a fixed amount of bits assigned to them (and therefore a fixed amount of optional values)
 * They are only used as the beginning of a DataStateDefinition to be able to find out which version of the data is actually being used
 * 
 * Acceptable bitwidths are: `4 | 6 | 8 | 10`, giving a total of respectively 16, 64, 256 and 1024 possible versions
 * Choose wisely, as it is not possible to increase this value later on (that would require the inclusion of an additional version object)
 */
export type VersionDataEntry = Prettify<VersionData & DataDescription>;

/**
 * Enum Array object
 *
 * enum arrays are as the name implies an array of enums.
 * This object interprets the enums as being a number of a specific base and translates them to base 2.
 * Besides the base, which is derived from the min and max (integer) values (its delta)
 * There is also a given min and max count of values.
 * The count itself is stored as the first bits, like for an Int object.
 * The value itself is implied by the length of the value array.
 *
 * Note: the partical maximum benefit of using this versus using a `ArrayEntryDataType` with only enums is only about 22% for base_5
 */
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

export const PROTECTED_ATTRIBUTE_NAMES = [
  'type',
  'value',
  'name',
  'internalName',
  'index',
  'min',
  'max',
  'bits',
  'precision',
  'significand',
  'minCount',
  'maxCount'
] as const;

export type DataEntryArray = DataEntry[];
