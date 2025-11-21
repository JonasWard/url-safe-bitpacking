import { DataType, DataTypeValues } from '@/enums';
import { ComplexDataEntry, DataEntry, NestedData } from '@/types';
import { updateComplexValue, updateValue } from './updateValues';

// updating a nested data array starts from the descriptor NestedData definition
// it goes through all the objects amd looks whether there is a match in the original NestedData at the same index that has the same type and name
// if there is a match, it updates the value of the `new` object with the value of the original

export const updateNestedData = (original: NestedData | undefined, descriptor: NestedData): NestedData => {
  // clone the descriptor object to avoid mutating the original
  const descriptorClone = JSON.parse(JSON.stringify(descriptor)) as NestedData;
  if (!original) return descriptorClone;

  return descriptorClone.map((d, i) =>
    original[i]?.type === d.type && original[i]?.name === d.name
      ? DataTypeValues.includes(original[i].type as DataType)
        ? updateValue(d as DataEntry, original[i] as DataEntry)
        : updateComplexValue(d as ComplexDataEntry, original[i] as ComplexDataEntry)
      : d
  );
};
