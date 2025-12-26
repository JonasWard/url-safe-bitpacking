import { DataEntry } from './dataEntry';

export type OptionalData = {
  type: 'OPTIONAL';
  state: boolean;
  descriptor: [DataEntry, null] | [null, DataEntry];
  value: DataEntry | null;
  stateBits: 1;
};
