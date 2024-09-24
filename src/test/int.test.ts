import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataBitsStringifier, dataBitsParser } from '../parsers';

export const values: [number, number, number, string][] = [
  // [0, 0, 0, '0'], // min
  [0, 0, 1, '0'], // min
  [1, 0, 1, '1'], // max
  [-10, -10, 10, '00000'], // min
  [0, -10, 10, '01010'], // mid
  [10, -10, 10, '10100'], // max
  [0, -10, 10, '01010'], // mid
  [10, -10, 10, '10100'], // max
  [0, 0, 15, '0000'], // min
  [3, 0, 15, '0011'], // min
  [15, 0, 15, '1111'], // min
  [10, 10, 20, '0000'], // min
  [15, 10, 20, '0101'], // mid
  [20, 10, 20, '1010'], // max
  [-10, -10, 20, '00000'], // min
  [20, -10, 20, '11110'], // min
  [-200, -200, 20, '00000000'], // min
  [-100, -200, 20, '01100100'], // mid
  [20, -200, 20, '11011100'], // max
];

values.forEach(([v, min, max, bitString]) =>
  test(`int ${v}, min: ${min}, max: ${max}`, () => expect(dataBitsStringifier(DataEntryFactory.createInt(v, min, max))).toBe(bitString))
);

values.forEach(([v, min, max, bitString]) =>
  test(`parsing '${bitString}' as int`, () => expect(dataBitsParser(bitString, DataEntryFactory.createInt(v, min, max)).value).toBe(v))
);
