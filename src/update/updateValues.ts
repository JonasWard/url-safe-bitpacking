import * as floatUpdate from './floatUpdate';
import * as intUpdate from './intUpdate';
import * as enumUpdate from './enumUpdate';
import * as versionUpdate from './versionUpdate';
import * as booleanUpdate from './booleanUpdate';
import * as enumArrayUpdate from './enumArrayUpdate';

import {
  BooleanDataEntry,
  DataEntry,
  EnumDataEntry,
  EnumArrayDataEntry,
  FloatDataEntry,
  IntDataEntry,
  VersionDataEntry
} from '../types/dataEntry';
import { DataType } from '../enums/dataTypes';

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
