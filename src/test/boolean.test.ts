import { expect, test } from 'bun:test';

import { DataEntryFactory } from '../factory/factory';
import { dataEntryBitsStringifier, dataEntryBitstringParser } from '../parsers';

export const values: [boolean, string][] = [
  [false, '0'],
  [true, '1']
];

values.forEach(([v, bitString]) =>
  test(`boolean ${v}`, () => expect(dataEntryBitsStringifier(DataEntryFactory.BOOLEAN(v))).toBe(bitString))
);

values.forEach(([v, bitString]) =>
  test(`parsing '${bitString}' as boolean`, () =>
    expect(dataEntryBitstringParser(DataEntryFactory.BOOLEAN(v), bitString)[0].value).toBe(v))
);
