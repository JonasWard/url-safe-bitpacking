import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataBitsStringifier, dataBitsParser } from '../parsers';
import { VersionRangeType } from '../types';

export const values: [number, VersionRangeType, string][] = [
  [0, 4, '0000'], // min
  [2, 4, '0010'], // any
  [15, 4, '1111'], // max
  [0, 6, '000000'], // min
  [8, 6, '001000'], // any
  [63, 6, '111111'], // max
  [0, 8, '00000000'], // min
  [12, 8, '00001100'], // any
  [255, 8, '11111111'], // max
  [0, 10, '0000000000'], // min
  [12, 10, '0000001100'], // any
  [1023, 10, '1111111111'], // max
];

values.forEach(([v, bitWidth, bitString]) =>
  test(`version ${v}, bit-width: ${bitWidth}`, () => expect(dataBitsStringifier(DataEntryFactory.createVersion(v, bitWidth))).toBe(bitString))
);

values.forEach(([v, bitWidth, bitString]) =>
  test(`parsing '${bitString}' as version`, () => expect(dataBitsParser(bitString, DataEntryFactory.createVersion(v, bitWidth)).value).toBe(v))
);
