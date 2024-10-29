import { DataEntry, DataEntryArray, NestedContentType, SingleLevelContentType, DoubleLevelContentType, ArrayEntryDataType, EnumEntryDataType, OptionalEntryDataType, DataEntryParsingReturnType, DerivativeStateDataType, InternalStateDataGenerationMethod, StateDataGenerationMethod, StateDataType } from '../types';
/**
 * Helper method for finding an existing data entry in case there was a previous object
 * @param dataEntry - new DataEntry
 * @param dataEntryArray - existing DataEntryArray
 */
export declare const findExistingDataEntry: (dataEntry: DataEntry, dataEntryArray: DataEntryArray) => DataEntry | undefined;
export declare const readDataEntry: (dataEntry: DataEntry, bitString: string) => DataEntryParsingReturnType;
export declare const updateDataEntry: (dataEntry: DataEntry, existingData: DataEntryArray) => DataEntryParsingReturnType;
export declare const internalGetDataEntry: (dataEntry: DataEntry, prefix: string, additionalData?: DataEntryArray | string) => [DataEntryArray | string | undefined, [string, DataEntry]];
export declare const getStateFromOptionalEntryDataType: (oedt: OptionalEntryDataType, prefix: string, attributeName: string) => InternalStateDataGenerationMethod;
export declare const getStateFromEnumEntryDataType: (eedt: EnumEntryDataType, prefix: string, attributeName: string) => (additionalData?: DataEntryArray | string) => [DataEntryArray | string | undefined, [string, StateDataType]];
export declare const getStateFromArrayEntryDataType: (aedt: ArrayEntryDataType, prefix: string, attributeName: string) => (additionalData?: DataEntryArray | string) => [DataEntryArray | string | undefined, [string, DerivativeStateDataType]];
export declare const getStateDataFromDoubleLevelContentType: (dct: DoubleLevelContentType, prefix: string, attributeName: string) => InternalStateDataGenerationMethod;
export declare const getStateDateFromSingleLevelContentTypeArray: (slcta: SingleLevelContentType[], prefix: string, attributeName: string) => (additionalData?: DataEntryArray | string) => [DataEntryArray | string | undefined, [string, StateDataType]];
export declare const getStateDataFromNestedContentType: (nct: NestedContentType, prefix: string, attributeName: string) => InternalStateDataGenerationMethod;
export declare const getStateDataFromSingleLevelContentType: (slct: SingleLevelContentType, prefix: string) => InternalStateDataGenerationMethod;
export declare const getGenerationMethodForSingleLevelContentTypeArray: (slct: SingleLevelContentType[]) => StateDataGenerationMethod;
export declare const testOnlyResetCurrentDataEntryIndex: () => number;
