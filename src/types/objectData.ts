import { DataEntry } from './dataEntry';

export type ObjectData = {
  type: 'OBJECT';
  stateBits: 0; // make this explicit because it still is a variable bit width data type
  state?: 0; // this is just here for reference, the state will always be 0 (so it can just as well be undefined)
  value: DataEntry[];
  descriptor: DataEntry[];
};
