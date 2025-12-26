import { create as createFloat } from './floatFactory';
import { create as createInt } from './intFactory';
import { create as createBoolean } from './booleanFactory';
import { create as createVersion } from './versionFactory';
import { create as createEnum } from './enumFactory';
import { create as createEnumArray } from './enumArrayFactory';
import { create as createOptional } from './optionalFactory';
import { create as createEnumOptions } from './enumOptionsFactory';
import { create as createArray } from './arrayFactory';
import { create as createObject } from './objectFactory';
import { DataEntry, ObjectDataEntry, VersionDataEntry } from '../types';

/**
 * Record containing all the factory methods for the different data entry objects
 */
export const DescriptorFactory = {
  FLOAT: createFloat as typeof createFloat,
  INT: createInt as typeof createInt,
  ENUM: createEnum as typeof createEnum,
  BOOLEAN: createBoolean as typeof createBoolean,
  VERSION: createVersion as typeof createVersion,
  ENUM_ARRAY: createEnumArray as typeof createEnumArray,
  OPTIONAL: createOptional as typeof createOptional,
  ENUM_OPTIONS: createEnumOptions as typeof createEnumOptions,
  ARRAY: createArray as typeof createArray,
  OBJECT: createObject as typeof createObject
};

export const StateDescriptorFactoryMethod = createObject as (
  descriptor: [VersionDataEntry, ...DataEntry[]],
  name?: string
) => ObjectDataEntry;