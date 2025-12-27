import { DataEntry } from './dataEntry';

export type ObjectData = {
  type: 'OBJECT';
  value: DataEntry[];
  descriptor: DataEntry[];
};
