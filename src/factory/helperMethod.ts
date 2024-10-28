import { VersionRange, VersionRangeType } from '../types';

export const getBitsForIntegerNumber = (number: number, maxBits: number): number => {
  const bitCount = Math.ceil(Math.log2(number));
  if (bitCount > maxBits) throw new Error(`Cannot get ${maxBits} bits for a number with ${bitCount} bits`);
  return bitCount;
};

export const getMinimumBitsForInteger = (v: number): number => Math.ceil(Math.log2(v));
export const getVersionValueRangeValueForNumber = (v: number): VersionRangeType => {
  const minBits = getMinimumBitsForInteger(v);
  const versionBits = VersionRange.find((x) => x >= minBits);
  if (versionBits === undefined)
    throw new Error(`Cannot find version range for ${v}, max amount of versions allowed is ${2 ** VersionRange[VersionRange.length - 1]}`);
  return versionBits;
};
export const getMaxIntegerValueForGivenBitWidth = (bitCount: number): number => 2 ** bitCount - 1;
