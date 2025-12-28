import { ObjectDataEntry } from './dataEntry';
import { EnumMappingType } from './enumData';

export type EnumOptionsData = {
  type: 'ENUM_OPTIONS';
  stateBits: number;
  state: number;
  descriptor: (ObjectDataEntry | null)[];
  mapping: EnumMappingType;
  value: ObjectDataEntry | null;
};
