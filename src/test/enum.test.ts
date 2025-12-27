import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataEntryBitsStringifier, dataEntryBitstringParser } from '../parsers';

export const values: [number, number, string][] = [
  [0, 7, '000'],
  [2, 7, '010'],
  [7, 7, '111']
];

values.forEach(([v, maxValue, bitString]) =>
  test(`enum ${v}`, () => expect(dataEntryBitsStringifier(DataEntryFactory.ENUM(v, maxValue))).toBe(bitString))
);

values.forEach(([v, maxValue, bitString]) =>
  test(`parsing '${bitString}' as enum`, () =>
    expect(dataEntryBitstringParser(DataEntryFactory.ENUM(v, maxValue), bitString)[0].value).toBe(v))
);

const bitCountMaxValue = [
  [0, 0],
  [1, 1],
  [2, 3],
  [3, 7],
  [4, 15],
  [5, 31],
  [6, 63],
  [7, 127],
  [8, 255]
];

bitCountMaxValue.forEach(([bitCount, maxValue]) =>
  test(`enum max value ${maxValue} should have ${bitCount} bits`, () =>
    expect(DataEntryFactory.ENUM(0, maxValue).bits).toBe(bitCount))
);

const bitCountValue = [
  [0, 0],
  [1, 1],
  [2, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [3, 7],
  [4, 8],
  [4, 9],
  [4, 10],
  [4, 11],
  [4, 12],
  [4, 13],
  [4, 14],
  [4, 15],
  [5, 16],
  [5, 17],
  [5, 18],
  [5, 19],
  [5, 20],
  [5, 21],
  [5, 22],
  [5, 23],
  [5, 24],
  [5, 25],
  [5, 26],
  [5, 27],
  [5, 28],
  [5, 29],
  [5, 30],
  [5, 31],
  [6, 32]
];

bitCountValue.forEach(([bitCount, value]) =>
  test(`enum value ${value} should have ${bitCount} bits`, () =>
    expect(DataEntryFactory.ENUM(value, value).bits).toBe(bitCount))
);

const bitCountValueThrowsError = [
  [9, 511],
  [10, 1023],
  [11, 2047],
  [12, 4095],
  [13, 8191]
];

bitCountValueThrowsError.forEach(([bitCount, maxValue]) =>
  test(`enum max value ${maxValue} should throw an error`, () =>
    expect(() => DataEntryFactory.ENUM(0, maxValue)).toThrow())
);