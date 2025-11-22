import { ComplexDataType, ComplexDataValues } from '@/enums';
import {
  complexDataStateStringifier,
  dataBitsStringifier,
  nestedDataBitstringParser,
  parseBase64ToBits,
  parseBitsToBase64
} from '@/parsers';
import { DataEntry, ComplexDataEntry } from '@/types';
import { State, StateDataEntry, StateDescriptor, StateObject } from '@/types/stateDataEntry';
import { updateComplexValue, updateValue } from '@/update';
import { getStateData } from './stateData';

const getBitstringForStateDataEntry = (stateDataEntry: StateDataEntry<DataEntry | ComplexDataEntry>): string => {
  switch (stateDataEntry.type) {
    case 'BOOLEAN':
    case 'INT':
    case 'ENUM':
    case 'FLOAT':
    case 'VERSION':
    case 'ENUM_ARRAY':
      return (stateDataEntry.bitstring = stateDataEntry.bitstring ?? dataBitsStringifier(stateDataEntry as DataEntry));
    case 'OPTIONAL':
      return stateDataEntry.value === null
        ? complexDataStateStringifier(stateDataEntry)
        : complexDataStateStringifier(stateDataEntry) +
            getBitstringForStateNestedData(stateDataEntry.value as StateDataEntry<DataEntry | ComplexDataEntry>[]);
    case 'ENUM_OPTIONS':
      return (
        complexDataStateStringifier(stateDataEntry) +
        getBitstringForStateNestedData(stateDataEntry.value as StateDataEntry<DataEntry | ComplexDataEntry>[])
      );
    case 'ARRAY':
      return (
        complexDataStateStringifier(stateDataEntry) +
        stateDataEntry.value
          .map((vs) => getBitstringForStateNestedData(vs as StateDataEntry<DataEntry | ComplexDataEntry>[]))
          .join('')
      );
  }
};

const getBitstringForStateNestedData = (nestedData: StateDataEntry<DataEntry | ComplexDataEntry>[]): string =>
  nestedData.map(getBitstringForStateDataEntry).join('');

const setComplexDataEntryValuesAsStateDataEntry = (
  currenEntry: StateDataEntry<ComplexDataEntry>,
  updateCallback: () => void
): void => {
  switch (currenEntry.type) {
    case 'OPTIONAL':
      currenEntry.value =
        currenEntry.value === null ? null : currenEntry.value.map((v) => getStateDataEntry(v, updateCallback));
      break;
    case 'ARRAY':
      currenEntry.value = currenEntry.value.map((vs) => vs.map((v) => getStateDataEntry(v, updateCallback)));
      break;
    case 'ENUM_OPTIONS':
      currenEntry.value = currenEntry.value.map((v) => getStateDataEntry(v, updateCallback));
      break;
  }
  const newBitString = getBitstringForStateDataEntry(currenEntry as StateDataEntry<DataEntry | ComplexDataEntry>);
  currenEntry.bitstring = newBitString;
};

const updateStateDataEntry = <T extends DataEntry | ComplexDataEntry>(
  currenEntry: StateDataEntry<T>,
  newEntry: T,
  updateCallback: () => void
): StateDataEntry<T> => {
  if (currenEntry.type !== newEntry.type || currenEntry.name !== newEntry.name)
    throw new Error(
      `Types (${currenEntry.type} & ${newEntry.type}) or names (${currenEntry.name} & ${newEntry.name}) do not match`
    );
  if (ComplexDataValues.includes(currenEntry.type as ComplexDataType)) {
    if ((currenEntry as ComplexDataEntry).state !== (newEntry as ComplexDataEntry).state) {
      const currentBitString = currenEntry.bitstring;
      const updatedCurrentEntry = updateComplexValue(
        currenEntry as ComplexDataEntry,
        newEntry as ComplexDataEntry
      ) as StateDataEntry<ComplexDataEntry>; // should be the same obejct as the currentEntry
      setComplexDataEntryValuesAsStateDataEntry(updatedCurrentEntry, updateCallback);
      if (currentBitString !== updatedCurrentEntry.bitstring) updateCallback();
    }
  } else {
    const currentBitString = currenEntry.bitstring;
    const updatedCurrentEntry = updateValue(
      currenEntry as DataEntry,
      newEntry as DataEntry
    ) as StateDataEntry<DataEntry>;
    updatedCurrentEntry.bitstring = dataBitsStringifier(updatedCurrentEntry as DataEntry);
    if (currentBitString !== updatedCurrentEntry.bitstring) updateCallback();
  }
  return currenEntry;
};

const getStateDataEntry = <T extends DataEntry | ComplexDataEntry>(
  entry: T,
  updateCallback: () => void
): StateDataEntry<T> => {
  (entry as StateDataEntry<T>).bitstring = getBitstringForStateDataEntry(
    entry as StateDataEntry<DataEntry | ComplexDataEntry>
  );
  (entry as StateDataEntry<T>).updateValue = (newEntry: T) =>
    updateStateDataEntry(entry as StateDataEntry<T>, newEntry as T, updateCallback);
  return entry as StateDataEntry<T>;
};

/**
 * Creates a state object from a state descriptor and updates the state object when the state changes.
 * @param initialState - the initial state descriptor
 * @param updateCallback - the callback that gets triggered when the state gets updated
 * @returns the state object
 */
export const createStateDataObject = (
  initialState: StateDescriptor,
  updateCallback: (currentState: StateObject) => StateObject
): StateObject => {
  const stateObject = {} as StateObject;

  const wrappedUpdateCallback = () => {
    stateObject.bitstring = getBitstringForStateNestedData(
      stateObject.state as StateDataEntry<DataEntry | ComplexDataEntry>[]
    );
    stateObject.base64 = parseBitsToBase64(stateObject.bitstring);
    stateObject.data = getStateData(stateObject.state);
    updateCallback(stateObject);
  };

  stateObject.state = initialState.map((item) => getStateDataEntry(item, wrappedUpdateCallback)) as State;
  wrappedUpdateCallback();

  return stateObject;
};

/**
 * Creates a state descriptor from a base64 string and a state descriptor
 * @param base64 - the base64 string
 * @param descriptor - the state descriptor
 * @returns the state descriptor
 */
export const getInitialStateFromBase64 = (base64: string, descriptor: StateDescriptor): StateDescriptor =>
  nestedDataBitstringParser(parseBase64ToBits(base64), descriptor)[0] as StateDescriptor;
