import { SingleLevelContentType } from './arrayDefinitions';
import { DataEntry, DataEntryArray } from './dataEntry';
import { EnumSemantics } from './semanticMapping';

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
export type ExposedParserStateDataMethod = (additionalData?: StateDataType | DataEntryArray | string) => StateDataType;
export type UpdateStateDataMethod = (state: StateDataType, entryToUpdate: DataEntry | DataEntry[]) => StateDataType;
export type StringifyStateDataMethod = (data: StateDataType | DataEntryArray) => string;
export type VersionContentDefinition = SingleLevelContentType[][];

export type VersionHandler = {
  versionBitCount: number;
  exposedVersions?: number[];
  enumSemanticsMapping?: EnumSemantics | EnumSemantics[];
  attributeSemanticsMapping?: Record<string, string> | Record<string, string>[];
  parser: ExposedParserStateDataMethod;
  updater: UpdateStateDataMethod;
  stringify: StringifyStateDataMethod;
};
