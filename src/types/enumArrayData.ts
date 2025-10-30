import { DataType } from '../enums/dataTypes';

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
export type EnumArrayData = {
  type: DataType.ENUM_ARRAY;
  minCount: number;
  maxCount: number;
  value: number[];
  min: number;
  max: number;
};
