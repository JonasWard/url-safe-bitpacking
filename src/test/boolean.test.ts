import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataBitsParser, dataBitsStringifier } from '../parsers';

export const values: [boolean, string][] = [
  [false, '0'],
  [true, '1'],
];

values.forEach(([v, bitString]) => test(`boolean ${v}`, () => expect(dataBitsStringifier(DataEntryFactory.createBoolean(v))).toBe(bitString)));

values.forEach(([v, bitString]) =>
  test(`parsing '${bitString}' as boolean`, () => expect(dataBitsParser(bitString, DataEntryFactory.createBoolean(v)).value).toBe(v))
);
