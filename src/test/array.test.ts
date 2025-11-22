import { expect, test } from 'bun:test';

import { ComplexDataEntryFactory, DataEntryFactory } from '../factory/factory';
import { complexDataStringifier, complexDataEntryBitstringParser } from '../parsers';
import { ComplexDataEntry, IntDataEntry } from '../types';
import { updateComplexValue } from '../update';

const intDefinition = DataEntryFactory.createInt(0, 0, 10, 'a number');
const getIntValueFromRawValues = (vs: number[], def: IntDataEntry, nested?: boolean) =>
  nested ? vs.map((value) => [{ ...def, value }]) : vs.map((value) => ({ ...def, value }));
const getComplexDataForValues = <T extends ComplexDataEntry>(c: T, value: T['value'], state: T['state']) =>
  ({ ...c, value, state } as T);

const enumArrayDefinition = DataEntryFactory.createEnumArray(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  10,
  1,
  11,
  'an enum array'
);

// maxCount, initialState, actualState, value `number[]`, bitString
const values: [number, number, number, number, number[], string][] = [
  [0, 10, 1, 2, [0, 1], '001000000001'],
  [0, 10, 1, 5, [0, 1, 2, 3, 4], '010100000001001000110100'],
  [0, 1, 1, 1, [10], '11010'],
  [1, 1, 1, 1, [10], '1010']
];

test('array_int', () => {
  values.forEach(([minCount, maxCount, initialState, actualState, value, bitString]) => {
    const complexData = ComplexDataEntryFactory.createArray([intDefinition], initialState, minCount, maxCount);
    const complexDataWithValues = getComplexDataForValues(
      complexData,
      getIntValueFromRawValues(value, intDefinition, true),
      actualState
    );

    expect(complexDataStringifier(complexDataWithValues)).toBe(bitString);
    expect(complexDataEntryBitstringParser(bitString, complexData)[0]).toMatchObject(complexDataWithValues);
  });
});

test('array_enum_array', () => {
  values.forEach(([minCount, maxCount, initialState, actualState]) => {
    const complexData = ComplexDataEntryFactory.createArray([enumArrayDefinition], initialState, minCount, maxCount);

    const complexDataWithValues = updateComplexValue(complexData, {
      ...complexData,
      state: actualState
    });

    const bitString = complexDataStringifier(complexDataWithValues);

    expect(complexDataStringifier(complexDataWithValues)).toBe(bitString);
    expect(complexDataEntryBitstringParser(bitString, complexData)[0]).toMatchObject(complexDataWithValues);
  });
});

test('array_in_array', () => {
  values.forEach(([minCount, maxCount, initialState, actualState]) => {
    const complexData = ComplexDataEntryFactory.createArray([enumArrayDefinition], initialState, minCount, maxCount);
    const complexDataNested = ComplexDataEntryFactory.createArray([complexData], initialState, minCount, maxCount);
    const complexDataWithValues = updateComplexValue(complexDataNested, {
      ...complexDataNested,
      state: actualState
    });

    const bitString = complexDataStringifier(complexDataWithValues);

    expect(complexDataStringifier(complexDataWithValues)).toBe(bitString);
    expect(complexDataEntryBitstringParser(bitString, complexDataNested)[0]).toMatchObject(complexDataWithValues);
  });
});

test('array change_state_value', () => {
  values.forEach(([minCount, maxCount, initialState, actualState]) => {
    const complexData = ComplexDataEntryFactory.createArray([intDefinition], initialState, minCount, maxCount);
  });
});
