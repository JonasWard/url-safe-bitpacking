import { DataEntry, DataEntryArray } from './dataEntry';

export type StateDataType = {
  [attribute: string]: DataEntry | StateDataType | DerivativeStateDataType;
};
export type DerivativeStateDataType = {
  s: DataEntry;
  v: StateDataType | StateDataType[];
};

export type StateValueType = {
  [attribute: string]: boolean | number | string | StateValueType | DerivativeStateValueType;
};

export type DerivativeStateValueType = {
  s: boolean | number | string;
  v: StateValueType | StateValueType[];
};

export type StateDataGenerationMethod = (additionalData?: DataEntryArray | string) => StateDataType;
export type DataEntryParsingReturnType = [DataEntryArray | string | undefined, [string, DataEntry]];
export type InternalStateDataGenerationMethod = (
  additionalData?: DataEntryArray | string
) => [DataEntryArray | string | undefined, [string, DataEntry | StateDataType | DerivativeStateDataType]];
