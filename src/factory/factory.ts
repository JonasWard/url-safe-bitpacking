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
export const DescriptorFactory = {
  FLOAT: createFloat,
  INT: createInt,
  ENUM: createEnum,
  BOOLEAN: createBoolean,
  VERSION: createVersion,
  ENUM_ARRAY: createEnumArray,
  OPTIONAL: createOptional,
  ENUM_OPTIONS: createEnumOptions,
  ARRAY: createArray
} as const;
