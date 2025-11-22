import { expect, test } from 'bun:test';
import { getMinimumBitsForInteger } from '../factory/helperMethod';

test('getMinimumBitsForInteger', () => {
  expect(getMinimumBitsForInteger(0)).toBe(0);
  expect(getMinimumBitsForInteger(1)).toBe(1);
  expect(getMinimumBitsForInteger(2)).toBe(2);
  expect(getMinimumBitsForInteger(3)).toBe(2);
  expect(getMinimumBitsForInteger(4)).toBe(3);
  expect(getMinimumBitsForInteger(5)).toBe(3);
  expect(getMinimumBitsForInteger(6)).toBe(3);
  expect(getMinimumBitsForInteger(7)).toBe(3);
  expect(getMinimumBitsForInteger(8)).toBe(4);
});
