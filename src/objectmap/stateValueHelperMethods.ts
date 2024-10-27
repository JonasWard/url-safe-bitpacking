import { dataArrayStringifier, parseBitsToBase64 } from '../parsers';
import { DataEntry, DataEntryArray } from '../types';
import { DerivativeStateDataType, DerivativeStateValueType, StateDataType, StateValueType } from '../types/stateValueModel';

const flattenDerivativeStateDataType = (stateValue: DerivativeStateDataType): DataEntryArray => [
  stateValue.s,
  ...(Array.isArray(stateValue.v) ? stateValue.v.map(getDataEntryArray).flat() : getDataEntryArray(stateValue.v)),
];

const internalGetDataEntryArray = (stateValue: StateDataType): DataEntryArray =>
  Object.values(stateValue)
    .map((content) => {
      if ((content as DataEntry).type !== undefined) return content as DataEntry;
      else if ((content as DerivativeStateDataType).s !== undefined && (content as DerivativeStateDataType).v !== undefined) {
        return flattenDerivativeStateDataType(content as DerivativeStateDataType);
      } else return internalGetDataEntryArray(content as StateDataType);
    })
    .flat();

const getStateValueHelperMethod = (
  stateValue: StateDataType | DataEntry | DerivativeStateDataType
): boolean | number | string | StateValueType | DerivativeStateValueType => {
  if ((stateValue as DataEntry).type !== undefined) return (stateValue as DataEntry).value;
  else if ((stateValue as DerivativeStateDataType).s !== undefined && (stateValue as DerivativeStateDataType).v !== undefined)
    return {
      s: (stateValue as DerivativeStateDataType).s.value,
      v: Array.isArray((stateValue as DerivativeStateDataType).v)
        ? ((stateValue as DerivativeStateDataType).v as StateDataType[]).map(getStateValue)
        : getStateValue((stateValue as DerivativeStateDataType).v as StateDataType),
    };
  else return getStateValue(stateValue as StateDataType);
};

export const getStateValue = (stateValue: StateDataType): StateValueType =>
  Object.fromEntries(Object.entries(stateValue).map(([key, value]) => [key, getStateValueHelperMethod(value)]));

export const getDataEntryArray = (stateValue: StateDataType): DataEntryArray => internalGetDataEntryArray(stateValue).sort((a, b) => a.index - b.index);

export const getBase64String = (stateValue: StateDataType): string => parseBitsToBase64(dataArrayStringifier(getDataEntryArray(stateValue)));
