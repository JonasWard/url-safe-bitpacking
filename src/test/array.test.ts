import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataEntryBitsStringifier, dataEntryBitstringParser } from '../parsers';
import { DataEntry, IntDataEntry } from '../types';
import { updateStateEntry } from '../update';
import { HasStateBitsDataTypes } from '../enums';

const intDefinition = DataEntryFactory.INT(0, 0, 10, 'a number');
const getIntValueFromRawValues = (vs: number[], def: IntDataEntry): IntDataEntry[] =>
  vs.map((value) => ({ ...def, value }));
const getComplexDataForValues = <T extends DataEntry & { type: (typeof HasStateBitsDataTypes)[number] }>(
  c: T,
  value: T['value'],
  state: T['state']
) => ({ ...c, value, state } as T);

const enumArrayDefinition = DataEntryFactory.ENUM_ARRAY([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10, 1, 11, 'an enum array');

// maxCount, initialState, actualState, value `number[]`, bitString
const values: [number, number, number, number, number[], string][] = [
  [0, 10, 1, 2, [0, 1], '001000000001'],
  [0, 10, 1, 5, [0, 1, 2, 3, 4], '010100000001001000110100'],
  [0, 1, 1, 1, [10], '11010'],
  [1, 1, 1, 1, [10], '1010']
];

test('array_int', () => {
  values.forEach(([minCount, maxCount, initialState, actualState, value, bitString]) => {
    const complexData = DataEntryFactory.ARRAY(intDefinition, initialState, minCount, maxCount);
    const complexDataWithValues = getComplexDataForValues(
      complexData,
      getIntValueFromRawValues(value, intDefinition),
      actualState
    );

    expect(dataEntryBitsStringifier(complexDataWithValues)).toBe(bitString);
    expect(dataEntryBitstringParser(complexData, bitString)[0]).toMatchObject(complexDataWithValues);
  });
});

test('array_enum_array', () => {
  values.forEach(([minCount, maxCount, initialState, actualState]) => {
    const complexData = DataEntryFactory.ARRAY(enumArrayDefinition, initialState, minCount, maxCount);

    const complexDataWithValues = updateStateEntry(complexData, actualState);

    const bitString = dataEntryBitsStringifier(complexDataWithValues);

    expect(dataEntryBitsStringifier(complexDataWithValues)).toBe(bitString);
    expect(dataEntryBitstringParser(complexData, bitString)[0]).toMatchObject(complexDataWithValues);
  });
});

test('array_in_array', () => {
  values.forEach(([minCount, maxCount, initialState, actualState]) => {
    const complexData = DataEntryFactory.ARRAY(enumArrayDefinition, initialState, minCount, maxCount);
    const complexDataNested = DataEntryFactory.ARRAY(complexData, initialState, minCount, maxCount);
    const complexDataWithValues = updateStateEntry(complexDataNested, actualState);

    const bitString = dataEntryBitsStringifier(complexDataWithValues);

    expect(dataEntryBitsStringifier(complexDataWithValues)).toBe(bitString);
    expect(dataEntryBitstringParser(complexDataNested, bitString)[0]).toMatchObject(complexDataWithValues);
  });
});

test('array change_state_value', () => {
  values.forEach(([minCount, maxCount, initialState, actualState]) => {
    const complexData = DataEntryFactory.ARRAY(intDefinition, initialState, minCount, maxCount);
  });
});
