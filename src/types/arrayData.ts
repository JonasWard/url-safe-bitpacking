import { DataEntry } from './dataEntry';

export type ArrayData = {
  type: 'ARRAY';
  minCount: number;
  maxCount: number;
  stateBits: number;
  state: number;
  descriptor: DataEntry;
  value: DataEntry[];
};
