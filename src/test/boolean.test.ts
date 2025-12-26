import { expect, test } from 'bun:test';

import { DescriptorFactory } from '../factory/factory';
import { dataEntryBitsStringifier, dataEntryBitstringParser } from '../parsers';

export const values: [boolean, string][] = [
  [false, '0'],
  [true, '1']
];

values.forEach(([v, bitString]) =>
  test(`boolean ${v}`, () => expect(dataEntryBitsStringifier(DescriptorFactory.BOOLEAN(v))).toBe(bitString))
);

values.forEach(([v, bitString]) =>
  test(`parsing '${bitString}' as boolean`, () =>
    expect(dataEntryBitstringParser(DescriptorFactory.BOOLEAN(v), bitString)[0].value).toBe(v))
);
