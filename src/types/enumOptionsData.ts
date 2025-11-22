import { NestedData } from './dataEntry';

export type EnumOptionsData = {
  type: 'ENUM_OPTIONS';
  stateBits: number;
  state: number;
  descriptor: NestedData[];
  value: NestedData;
};
