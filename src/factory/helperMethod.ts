import { VersionRange, VersionRangeType } from '../types';

/**
 * Helper method to get the minimum bits required to store a given integer value
 * @param number - `number` value to get the minimum bits for
 * @param maxBits - `number` maximum bits allowed
 */
export const getBitsForIntegerNumber = (number: number, maxBits: number): number => {
  const bitCount = Math.ceil(Math.log2(number));
  if (bitCount > maxBits) throw new Error(`Cannot get ${maxBits} bits for a number with ${bitCount} bits`);
  return bitCount;
};

/**
 * Helper method to get the minimum bits required to store a given integer value
 * @param v - `number` value to get the minimum bits for
 */
export const getMinimumBitsForInteger = (v: number): number => Math.ceil(Math.log2(v));

/**
 * Helper method to get the version value range value for a given number
 * @param v - `number` value to get the version value range value for
 * @returns `VersionRangeType` the version value range value
 */
export const getVersionValueRangeValueForNumber = (v: number): VersionRangeType => {
  const minBits = getMinimumBitsForInteger(v);
  const versionBits = VersionRange.find((x) => x >= minBits);
  if (versionBits === undefined)
    throw new Error(`Cannot find version range for ${v}, max amount of versions allowed is ${2 ** VersionRange[VersionRange.length - 1]}`);
  return versionBits;
};

/**
 * Helper method to get the maximum integer value for a given bit width
 * @param bitCount - `number` bit width to get the maximum integer value for
 * @returns `number` the maximum integer value
 */
export const getMaxIntegerValueForGivenBitWidth = (bitCount: number): number => 2 ** bitCount - 1;
