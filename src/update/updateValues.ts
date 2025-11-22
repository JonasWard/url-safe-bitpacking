import * as floatUpdate from './floatUpdate';
import * as intUpdate from './intUpdate';
import * as enumUpdate from './enumUpdate';
import * as versionUpdate from './versionUpdate';
import * as booleanUpdate from './booleanUpdate';
import * as enumArrayUpdate from './enumArrayUpdate';
import * as optionalUpdate from './optionalUpdate';
import * as enumOptionsUpdate from './enumOptionsUpdate';
import * as arrayUpdate from './arrayUpdate';

import {
  BooleanDataEntry,
  DataEntry,
  EnumDataEntry,
  EnumArrayDataEntry,
  FloatDataEntry,
  IntDataEntry,
  VersionDataEntry,
  ComplexDataEntry,
  EnumOptionsDataEntry,
  OptionalDataEntry,
  ArrayDataEntry
} from '../types/dataEntry';

/**
 * Method to update the value of a data entry
 * @param original - the original data entry
 * @param update - the update data entry
 * @returns the updated data entry
 */
export const updateValue = (original: DataEntry, update: DataEntry): DataEntry => {
  if (original.type !== update.type) throw new Error('Types do not match');
  switch (original.type) {
    case 'FLOAT':
      return floatUpdate.updateValue(original, update as FloatDataEntry);
    case 'INT':
      return intUpdate.updateValue(original, update as IntDataEntry);
    case 'ENUM':
      return enumUpdate.updateValue(original, update as EnumDataEntry);
    case 'BOOLEAN':
      return booleanUpdate.updateValue(original, update as BooleanDataEntry);
    case 'VERSION':
      return versionUpdate.updateValue(original, update as VersionDataEntry);
    case 'ENUM_ARRAY':
      return enumArrayUpdate.updateValue(original, update as EnumArrayDataEntry);
  }
};

/**
 * Method to update the value of a data entry
 * @param original - the original data entry
 * @param update - the update data entry
 * @returns the updated data entry
 */
export const updateComplexValue = (original: ComplexDataEntry, update: ComplexDataEntry): ComplexDataEntry => {
  if (original.type !== update.type) throw new Error('Types do not match');
  switch (original.type) {
    case 'OPTIONAL':
      return optionalUpdate.updateComplexValue(original, update as OptionalDataEntry);
    case 'ENUM_OPTIONS':
      return enumOptionsUpdate.updateComplexValue(original, update as EnumOptionsDataEntry);
    case 'ARRAY':
      return arrayUpdate.updateComplexValue(original, update as ArrayDataEntry);
  }
};