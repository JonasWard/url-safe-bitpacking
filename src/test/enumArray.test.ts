import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataArrayStringifier, dataBitsParser, dataBitsStringifier } from '../parsers';
import { ArrayEntryDataType, StateDataType } from '../types';
import { getDataEntryArray, getStateFromArrayEntryDataType, getStateValue } from '../objectmap';

/**
 * `value` - array of numbers
 * `min` - minimum value of the numbers
 * `max` - maximum value of the numbers
 * `minCount` - minimum count of the numbers
 * `maxCount` - maximum count of the numbers
 * `bitString` - Stringified output -> bit string of the numbers
 */
export const values: [number[], number, number, number, number, string][] = [
  [[0], 0, 1, 1, 2, '00'],
  [[0, 1, 2, 2, 3, 4, 5, 6, 7, 7, 8], 0, 8, 1, 13, '101011100110100000111100001011010111101'],
  [[0, 1, 2, 2, 3, 4, 5, 6, 7, 7, 8], 0, 8, 11, 11, '11100110100000111100001011010111101'],
  [[0, 1, 2, 2, 3, 4, 5, 6, 7, 7, 8], -16, 15, 11, 11, '1100010111101111011010101101001001110010100101000110000'],
  [
    [...Array.from({ length: 32 }, (_, i) => i - 16)],
    -16,
    15,
    1,
    32,
    '111111111111110111011110011011110101100111000101111011010101101001001110010100011000001111011100110101100010110101001001010000011100110001010010000011000100000100000'
  ]
];

values.forEach(([value, min, max, minCount, maxCount, bitString]) =>
  test(`enum_array ${value}`, () =>
    expect(dataBitsStringifier(DataEntryFactory.createEnumArray(value, min, max, minCount, maxCount))).toBe(bitString))
);

values.forEach(([value, min, max, minCount, maxCount, bitString]) =>
  test(`parsing '${bitString}' as enum_array`, () =>
    expect(
      dataBitsParser(bitString, DataEntryFactory.createEnumArray(value, min, max, minCount, maxCount)).value
    ).toMatchObject(value))
);

test('enum_array vs array_int', () => {
  const values: [number, number, number][] = [];

  for (let base = 1; base < 256; base++) {
    for (let count = 125; count <= 125; count++) {
      const arrayIntDefintion: ArrayEntryDataType = [[count, count + 1], [DataEntryFactory.createInt(0, 0, base)]];

      const dataEntry = DataEntryFactory.createEnumArray(
        [...Array.from({ length: count }, (_, i) => i % base)],
        0,
        base,
        count,
        count + 1
      );

      const [_, [__, stateData]] = getStateFromArrayEntryDataType(arrayIntDefintion, '', 'arrayInt')();

      const dataEntryBitString = dataBitsStringifier(dataEntry);
      const bitString = dataArrayStringifier(getDataEntryArray(stateData as StateDataType));

      values.push([dataEntryBitString.length / bitString.length, count, base]);
    }
  }

  const sorted = values.sort((a, b) => a[0] - b[0]);

  const avgPerBase: { [key: number]: number[] } = {};
  for (const [avg, count, base] of sorted) {
    if (!avgPerBase[base]) avgPerBase[base] = [];
    avgPerBase[base].push(avg);
  }

  // for (const [base, avgs] of Object.entries(avgPerBase)) {
  //   console.log(`Base ${base}: ${Math.min(...avgs)}`);
  // }

  // console.log({ min: sorted[0], max: sorted[sorted.length - 1], median: sorted[Math.floor(values.length / 2)] });

  expect(true).toBe(true);
});
