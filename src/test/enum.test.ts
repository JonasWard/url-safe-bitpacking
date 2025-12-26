import { expect, test } from 'bun:test';

import { DescriptorFactory } from '../factory/factory';
import { dataEntryBitsStringifier, dataEntryBitstringParser } from '../parsers';

export const values: [number, number, string][] = [
  [0, 7, '000'],
  [2, 7, '010'],
  [7, 7, '111']
];

values.forEach(([v, maxValue, bitString]) =>
  test(`enum ${v}`, () => expect(dataEntryBitsStringifier(DescriptorFactory.ENUM(v, maxValue))).toBe(bitString))
);

values.forEach(([v, maxValue, bitString]) =>
  test(`parsing '${bitString}' as enum`, () =>
    expect(dataEntryBitstringParser(DescriptorFactory.ENUM(v, maxValue), bitString)[0].value).toBe(v))
);
