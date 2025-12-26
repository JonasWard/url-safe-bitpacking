import { DataEntry } from './dataEntry';
import { EnumMappingType } from './enumData';

export type EnumOptionsData = {
  type: 'ENUM_OPTIONS';
  stateBits: number;
  state: number;
  descriptor: (DataEntry | null)[];
  mapping: EnumMappingType;
  value: DataEntry | null;
};
