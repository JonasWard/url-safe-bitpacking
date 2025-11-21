import { ComplexDataEntry, DataEntry, NestedData, VersionDataEntry } from './dataEntry';

export type StateDataEntry<T extends DataEntry | ComplexDataEntry> = T & {
  bitstring: string;
  updateValue: (newEntry: T) => void;
};
export type State = [StateDataEntry<VersionDataEntry>, ...StateDataEntry<DataEntry | ComplexDataEntry>[]];

export type StateDescriptor = [VersionDataEntry, ...NestedData];
export type StateDataObject = {
  [key: string]:
    | object
    | string
    | boolean
    | number
    | (string | number | object)[]
    | null
    | StateDataObject
    | StateDataObject[];
};

export type StateObject = {
  state: State;
  bitstring: string;
  base64: string;
  data: StateDataObject;
};
