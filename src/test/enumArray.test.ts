import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataEntryBitsStringifier, dataEntryBitstringParser } from '../parsers';

/**
 * `value` - array of numbers
 * `max` - maximum value of the numbers
 * `minCount` - minimum count of the numbers
 * `maxCount` - maximum count of the numbers
 * `bitString` - Stringified output -> bit string of the numbers
 */
export const values: [number[], number, number, number, string][] = [
  [[0], 1, 1, 2, '00'],
  [[0, 1, 2, 2, 3, 4, 5, 6, 7, 7, 8], 8, 1, 13, '101011100110100000111100001011010111101'],
  [[0, 1, 2, 2, 3, 4, 5, 6, 7, 7, 8], 8, 11, 11, '11100110100000111100001011010111101'],
  [[0, 1, 2, 2, 3, 4, 5, 6, 7, 7, 8], 15, 11, 11, '10000111011101100101010000110010001000010000'],
  [
    [...Array.from({ length: 32 }, (_, i) => i)],
    31,
    1,
    32,
    '111111111111110111011110011011110101100111000101111011010101101001001110010100011000001111011100110101100010110101001001010000011100110001010010000011000100000100000'
  ]
];

values.forEach(([value, max, minCount, maxCount, bitString]) =>
  test(`enum_array ${value}`, () =>
    expect(dataEntryBitsStringifier(DataEntryFactory.ENUM_ARRAY(value, max, minCount, maxCount))).toBe(bitString))
);

values.forEach(([value, max, minCount, maxCount, bitString]) =>
  test(`parsing '${bitString}' as enum_array`, () =>
    expect(
      dataEntryBitstringParser(DataEntryFactory.ENUM_ARRAY(value, max, minCount, maxCount), bitString)[0].value
    ).toMatchObject(value))
);
