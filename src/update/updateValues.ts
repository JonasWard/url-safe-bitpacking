import * as floatUpdate from './floatUpdate';
import * as intUpdate from './intUpdate';
import * as enumUpdate from './enumUpdate';
import * as versionUpdate from './versionUpdate';
import * as booleanUpdate from './booleanUpdate';
import * as enumArrayUpdate from './enumArrayUpdate';
import * as optionalUpdate from './optionalUpdate';
import * as enumOptionsUpdate from './enumOptionsUpdate';
import * as arrayUpdate from './arrayUpdate';
import * as objectUpdate from './objectUpdate';

import {
  BooleanDataEntry,
  EnumDataEntry,
  EnumArrayDataEntry,
  FloatDataEntry,
  IntDataEntry,
  VersionDataEntry,
  EnumOptionsDataEntry,
  OptionalDataEntry,
  ArrayDataEntry,
  ObjectDataEntry,
  UpdateWithStateEntries,
  UpdateWithValidationTypes,
  UpdateWithValuesEntries
} from '../types';

/**
 * Method to update the value of a data entry
 * MUTATES OBJECT IN PLACE!
 * @param original - the original data entry
 * @param update - the update data entry
 * @returns the updated data entry
 */
export const updateValueEntry = <T extends UpdateWithValuesEntries>(original: T, update: T['value']): T => {
  switch (original.type) {
    case 'FLOAT':
      return floatUpdate.updateValue(original, update as FloatDataEntry['value']) as T;
    case 'INT':
      return intUpdate.updateValue(original, update as IntDataEntry['value']) as T;
    case 'ENUM':
      return enumUpdate.updateValue(original, update as EnumDataEntry['value']) as T;
    case 'BOOLEAN':
      return booleanUpdate.updateValue(original, update as BooleanDataEntry['value']) as T;
    case 'VERSION':
      return versionUpdate.updateValue(original, update as VersionDataEntry['value']) as T;
    case 'ENUM_ARRAY':
      return enumArrayUpdate.updateValue(original, update as EnumArrayDataEntry['value']) as T;
    case 'OBJECT':
      return objectUpdate.updateValue(original, update as ObjectDataEntry['value']) as T;
  }
};

export const constrainValue = <T extends UpdateWithValidationTypes>(original: T, update: T['value']): T['value'] => {
  switch (original.type) {
    case 'FLOAT':
      return floatUpdate.constrainValue(original, update as FloatDataEntry['value']);
    case 'INT':
      return intUpdate.constrainValue(original, update as IntDataEntry['value']);
    case 'ENUM':
      return enumUpdate.constrainValue(original, update as EnumDataEntry['value']);
    case 'BOOLEAN':
      return booleanUpdate.constrainValue(original, update as BooleanDataEntry['value']);
    case 'VERSION':
      return versionUpdate.constrainValue(original, update as VersionDataEntry['value']);
    case 'ENUM_ARRAY':
      return enumArrayUpdate.constrainValue(original, update as EnumArrayDataEntry['value']);
  }
};

/**
 * Method to update the value of a data entry
 * @param original - the original data entry
 * @param update - the update data entry
 */
export const updateStateEntry = <T extends UpdateWithStateEntries>(
  original: T,
  update: T['state'],
  current?: T['value']
): T => {
  switch (original.type) {
    case 'OPTIONAL':
      return optionalUpdate.updateState(
        original,
        update as OptionalDataEntry['state'],
        current as OptionalDataEntry['value']
      ) as T;
    case 'ENUM_OPTIONS':
      return enumOptionsUpdate.updateState(
        original,
        update as EnumOptionsDataEntry['state'],
        current as EnumOptionsDataEntry['value']
      ) as T;
    case 'ARRAY':
      return arrayUpdate.updateState(
        original,
        update as ArrayDataEntry['state'],
        current as ArrayDataEntry['value']
      ) as T;
  }
};
