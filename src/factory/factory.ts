import { create as createFloat } from './floatFactory';
import { create as createInt } from './intFactory';
import { create as createBoolean } from './booleanFactory';
import { create as createVersion } from './versionFactory';
import { create as createEnum } from './enumFactory';

import { FloatDataEntry, IntDataEntry, EnumDataEntry, VersionDataEntry, BooleanDataEntry } from '../types/dataEntry';
import { PrecisionRangeType } from '../types/floatData';
import { VersionRangeType } from '../types/versionData';

export class DataEntryFactory {
  public static createFloat = createFloat;
  public static createInt = createInt;
  public static createEnum = createEnum;
  public static createBoolean = createBoolean;
  public static createVersion = createVersion;
}
