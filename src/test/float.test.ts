import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataBitsParser, dataBitsStringifier } from '../parsers';
import { PrecisionRangeType } from '../types';

export const values: [number, number, number, PrecisionRangeType, string][] = [
  [1, 0, 1, 0, '1'], // max
  [0, 0, 1, 1, '0000'], // min
  [0.2, 0, 1, 1, '0010'], // middle
  [0.4, 0, 1, 1, '0100'], // middle
  [0.8, 0, 1, 1, '1000'], // middle
  [1, 0, 1, 1, '1010'], // max
  [-10, -10, 10, 0, '00000'], // min
  [0, -10, 10, 1, '01100100'], // middle
  [10, -10, 10, 1, '11001000'], // max
  [0, 0, 15, 1, '00000000'], // min
  [3, 0, 15, 1, '00011110'], // min
  [15, 0, 15, 1, '10010110'], // max
  [0, 0, 1, 2, '0000000'], // min
  [0.07, 0, 1, 2, '0000111'], // min
  [0.61, 0, 1, 2, '0111101'], // min
  [1, 0, 1, 2, '1100100'], // min
  [0, 0, 1, 3, '0000000000'], // min
  [0.065, 0, 1, 3, '0001000001'], // min
  [0.598, 0, 1, 3, '1001010110'], // min
  [1, 0, 1, 3, '1111101000'], // min
];

values.forEach(([v, min, max, precision, bitString]) =>
  test(`float ${v}, min: ${min}, max: ${max}, precision: ${precision}`, () =>
    expect(dataBitsStringifier(DataEntryFactory.createFloat(v, min, max, precision))).toBe(bitString))
);

values.forEach(([v, min, max, precision, bitString]) =>
  test(`parsing '${bitString}' as float`, () => expect(dataBitsParser(bitString, DataEntryFactory.createFloat(v, min, max, precision)).value).toBe(v))
);
