import { create as createFloat } from './floatFactory';
import { create as createInt } from './intFactory';
import { create as createBoolean } from './booleanFactory';
import { create as createVersion } from './versionFactory';
import { create as createEnum } from './enumFactory';
import { create as createEnumArray } from './enumArrayFactory';
import { create as createOptional } from './optionalFactory';
import { create as createEnumOptions } from './enumOptionsFactory';
import { create as createArray } from './arrayFactory';

/**
 * Record containing all the factory methods for the different data entry objects
 */
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

export const ComplexDataEntryFactory: {
  createOptional: typeof createOptional;
  createEnumOptions: typeof createEnumOptions;
  createArray: typeof createArray;
} = {
  createOptional,
  createEnumOptions,
  createArray
};