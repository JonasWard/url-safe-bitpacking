import { NestedData } from './dataEntry';

export type ArrayData = {
  type: 'ARRAY';
  minCount: number;
  maxCount: number;
  stateBits: number;
  state: number;
  descriptor: NestedData;
  value: NestedData[];
};
