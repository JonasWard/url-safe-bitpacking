import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataBitsParser, dataBitsStringifier } from '../parsers';

export const values: [number, number, string][] = [
  [0, 7, '000'],
  [2, 7, '010'],
  [7, 7, '111'],
];

values.forEach(([v, maxValue, bitString]) => test(`enum ${v}`, () => expect(dataBitsStringifier(DataEntryFactory.createEnum(v, maxValue))).toBe(bitString)));

values.forEach(([v, maxValue, bitString]) =>
  test(`parsing '${bitString}' as enum`, () => expect(dataBitsParser(bitString, DataEntryFactory.createEnum(v, maxValue)).value).toBe(v))
);
