import { create as createFloat } from './floatFactory';
import { create as createInt } from './intFactory';
import { create as createBoolean } from './booleanFactory';
import { create as createVersion } from './versionFactory';
import { create as createEnum } from './enumFactory';
import { create as createEnumArray } from './enumArrayFactory';

export const DataEntryFactory: {
  createFloat: typeof createFloat;
  createInt: typeof createInt;
  createEnum: typeof createEnum;
  createBoolean: typeof createBoolean;
  createVersion: typeof createVersion;
  createEnumArray: typeof createEnumArray;
} = {
  createFloat,
  createInt,
  createEnum,
  createBoolean,
  createVersion,
  createEnumArray
};
