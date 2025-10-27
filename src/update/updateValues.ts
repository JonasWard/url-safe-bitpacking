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

export const updateValue = (original: DataEntry, update: DataEntry): DataEntry => {
  if (original.type !== update.type) throw new Error('Types do not match');
  switch (original.type) {
    case DataType.FLOAT:
      return floatUpdate.updateValue(original, update as FloatDataEntry);
    case DataType.INT:
      return intUpdate.updateValue(original, update as IntDataEntry);
    case DataType.ENUM:
      return enumUpdate.updateValue(original, update as EnumDataEntry);
    case DataType.BOOLEAN:
      return booleanUpdate.updateValue(original, update as BooleanDataEntry);
    case DataType.VERSION:
      return versionUpdate.updateValue(original, update as VersionDataEntry);
    case DataType.ENUM_ARRAY:
      return enumArrayUpdate.updateValue(original, update as EnumArrayDataEntry);
  }
};
