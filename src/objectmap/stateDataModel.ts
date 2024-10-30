import { DataEntryFactory } from '../factory';
import { dataEntryBitstringParser } from '../parsers';
import {
  DataEntry,
  DataEntryArray,
  PREFIX_SEPERATOR_DELIMETER,
  NestedContentType,
  SingleLevelContentType,
  DoubleLevelContentType,
  ArrayEntryDataType,
  EnumEntryDataType,
  OptionalEntryDataType,
  NestedContentDataType,
  NonEmptyValidEntryArrayType,
  DataEntryParsingReturnType,
  DerivativeStateDataType,
  InternalStateDataGenerationMethod,
  StateDataGenerationMethod,
  StateDataType,
  EnumDataEntry,
  IntDataEntry,
} from '../types';
import { updateValue } from '../update';
import {
  doubleLevelContentTypeIsArrayDefinitionType,
  doubleLevelContentTypeIsEnumEntryDataType,
  doubleLevelContentTypeIsOptionalEntryDataType,
  isDoubleLevelContentType,
  singleLevelContentTypeIsDataEntry,
  singleLevelContentTypeIsNestedContentDataType,
} from './stateValueHelperMethods';

let currentDataEntryIndex = 0;

/**
 * Helper method for finding an existing data entry in case there was a previous object
 * @param dataEntry - new DataEntry
 * @param dataEntryArray - existing DataEntryArray
 */
export const findExistingDataEntry = (dataEntry: DataEntry, dataEntryArray: DataEntryArray): DataEntry | undefined =>
  dataEntryArray.find((d) => (d.internalName ?? d.name) === (dataEntry.internalName ?? dataEntry.name));

export const readDataEntry = (dataEntry: DataEntry, bitString: string): DataEntryParsingReturnType => {
  const [d, slicedBitstring] = dataEntryBitstringParser(bitString, dataEntry);
  currentDataEntryIndex++;
  return [slicedBitstring, [d.name, { ...d, index: currentDataEntryIndex }]];
};

export const updateDataEntry = (dataEntry: DataEntry, existingData: DataEntryArray): DataEntryParsingReturnType => {
  const existingDataEntry = findExistingDataEntry(dataEntry, existingData);
  currentDataEntryIndex++;
  return [existingData, [dataEntry.name, { ...(existingDataEntry ? updateValue(dataEntry, existingDataEntry) : dataEntry), index: currentDataEntryIndex }]];
};

export const internalGetDataEntry = (
  dataEntry: DataEntry,
  prefix: string,
  additionalData?: DataEntryArray | string
): [DataEntryArray | string | undefined, [string, DataEntry]] => {
  const internalName = `${prefix}${PREFIX_SEPERATOR_DELIMETER}${dataEntry.name}`;
  const localDataEntry = { ...dataEntry, internalName };
  if (additionalData) {
    if (typeof additionalData === 'string') return readDataEntry(localDataEntry, additionalData);
    else return updateDataEntry(localDataEntry, additionalData);
  }
  currentDataEntryIndex++;
  return [undefined, [localDataEntry.name, { ...localDataEntry, index: currentDataEntryIndex }]];
};

export const getStateFromOptionalEntryDataType =
  (oedt: OptionalEntryDataType, prefix: string, attributeName: string): InternalStateDataGenerationMethod =>
  (additionalData?: DataEntryArray | string): [DataEntryArray | string | undefined, [string, StateDataType]] => {
    const [updatedLocalAdditionalData, [__, s]] = internalGetDataEntry(DataEntryFactory.createBoolean(oedt[0], attributeName), prefix, additionalData);

    const [localAdditionalData, [_, v]] = getStateDateFromSingleLevelContentTypeArray(
      oedt[Number(s.value) + 1] as NonEmptyValidEntryArrayType | [],
      s.internalName as string,
      attributeName
    )(updatedLocalAdditionalData);

    return [
      localAdditionalData,
      [
        attributeName,
        {
          s,
          v,
        },
      ],
    ];
  };

export const getStateFromEnumEntryDataType =
  (eedt: EnumEntryDataType, prefix: string, attributeName: string) =>
  (additionalData?: DataEntryArray | string): [DataEntryArray | string | undefined, [string, StateDataType]] => {
    if (Math.round(eedt[0]) !== eedt[0]) `given default (${eedt[0]}) value isn't an integer, rounding it`;
    if (eedt.length - 2 < Math.round(eedt[0]))
      console.log(`given default value (${eedt[0]}) was larger than the amount of options available, using the largest value (${eedt.length - 2}) instead`);
    if (eedt[0] < 0) console.log(`given default value (${eedt[0]}) was negative, using first index (0) instead`);

    const [updatedLocalAdditionalData, [__, s]] = internalGetDataEntry(
      DataEntryFactory.createEnum(Math.max(Math.min(eedt.length - 2, Math.round(eedt[0])), 0), eedt.length - 1, attributeName),
      prefix,
      additionalData
    );

    const [nestedAdditionalData, [_, v]] = getStateDateFromSingleLevelContentTypeArray(
      eedt[1 + (s as EnumDataEntry).value] as NonEmptyValidEntryArrayType | SingleLevelContentType[],
      s.internalName as string,
      attributeName
    )(updatedLocalAdditionalData);

    return [
      nestedAdditionalData,
      [
        attributeName,
        {
          s,
          v,
        },
      ],
    ];
  };

export const getStateFromArrayEntryDataType =
  (aedt: ArrayEntryDataType, prefix: string, attributeName: string) =>
  (additionalData?: DataEntryArray | string): [DataEntryArray | string | undefined, [string, DerivativeStateDataType]] => {
    const [min, max] = [aedt[0][0], aedt[0][1]].sort((a, b) => a - b);
    const [updatedAdditionalData, [__, s]] = internalGetDataEntry(DataEntryFactory.createInt(min, min, max, attributeName), prefix, additionalData);

    const v: StateDataType[] = [];
    let localAdditionalData: DataEntryArray | string | undefined = updatedAdditionalData;
    for (let i = 0; i < (s as IntDataEntry).value; i++) {
      const [updateAdditionalData, [_, localStateData]] = getStateDateFromSingleLevelContentTypeArray(
        aedt[1],
        `${s.internalName}${PREFIX_SEPERATOR_DELIMETER}${i}`,
        attributeName
      )(localAdditionalData);
      localAdditionalData = updateAdditionalData;

      v.push(localStateData);
    }
    return [
      localAdditionalData,
      [
        attributeName,
        {
          s,
          v,
        },
      ],
    ];
  };

export const getStateDataFromDoubleLevelContentType = (
  dct: DoubleLevelContentType,
  prefix: string,
  attributeName: string
): InternalStateDataGenerationMethod => {
  if (doubleLevelContentTypeIsEnumEntryDataType(dct)) return getStateFromEnumEntryDataType(dct as EnumEntryDataType, prefix, attributeName);
  else if (doubleLevelContentTypeIsOptionalEntryDataType(dct)) return getStateFromOptionalEntryDataType(dct as OptionalEntryDataType, prefix, attributeName);
  else if (doubleLevelContentTypeIsArrayDefinitionType(dct)) return getStateFromArrayEntryDataType(dct as ArrayEntryDataType, prefix, attributeName);

  throw new Error('this is an invalid output value, wonder why?');
};

export const getStateDateFromSingleLevelContentTypeArray =
  (slcta: SingleLevelContentType[], prefix: string, attributeName: string) =>
  (additionalData?: DataEntryArray | string): [DataEntryArray | string | undefined, [string, StateDataType]] => {
    const outputDataObject: StateDataType = {};
    let intermediateAdditionalData: DataEntryArray | string | undefined = additionalData;
    slcta.forEach((slct) => {
      const [localAdditionalData, [localAttributeName, nestedData]] = getStateDataFromSingleLevelContentType(slct, prefix)(intermediateAdditionalData);
      intermediateAdditionalData = localAdditionalData;
      outputDataObject[localAttributeName] = nestedData;
    });
    return [intermediateAdditionalData, [attributeName, outputDataObject]];
  };

export const getStateDataFromNestedContentType = (nct: NestedContentType, prefix: string, attributeName: string): InternalStateDataGenerationMethod => {
  if (isDoubleLevelContentType(nct))
    return getStateDataFromDoubleLevelContentType(nct as DoubleLevelContentType, `${prefix}${PREFIX_SEPERATOR_DELIMETER}${attributeName}`, attributeName);
  return getStateDateFromSingleLevelContentTypeArray(nct as SingleLevelContentType[], prefix, attributeName);
};

export const getStateDataFromSingleLevelContentType = (slct: SingleLevelContentType, prefix: string): InternalStateDataGenerationMethod => {
  if (singleLevelContentTypeIsDataEntry(slct))
    return (additionalData?: DataEntryArray | string) => internalGetDataEntry(slct as DataEntry, prefix, additionalData);
  else if (singleLevelContentTypeIsNestedContentDataType(slct))
    return getStateDataFromNestedContentType(
      (slct as NestedContentDataType)[1],
      `${prefix}_${(slct as NestedContentDataType)[0]}`,
      (slct as NestedContentDataType)[0]
    );

  throw new Error('this is an invalid output value, wonder why?');
};

export const getGenerationMethodForSingleLevelContentTypeArray = (slct: SingleLevelContentType[]): StateDataGenerationMethod => {
  currentDataEntryIndex = -1;
  return (additionalData?: DataEntryArray | string): StateDataType => getStateDateFromSingleLevelContentTypeArray(slct, '', '')(additionalData)[1][1];
};

export const testOnlyResetCurrentDataEntryIndex = (): number => (currentDataEntryIndex = -1);
