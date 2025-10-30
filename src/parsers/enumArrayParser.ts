import { getBitsForIntegerNumber } from '@/factory/helperMethod';
import { EnumArrayData } from '../types/enumArrayData';
import { rawValueParser as rawIntParser, rawIntStringifier } from './intParser';
import { IntegerMaxBits } from '@/types';
import {
  convertArbitraryBaseToBitString,
  convertBitStringToArbitraryBase,
  getBitsForEnumArrayCountOfBase
} from './parsers';

const getCountBitsCount = (enumArrayData: EnumArrayData): number =>
  getBitsForIntegerNumber(enumArrayData.maxCount - enumArrayData.minCount + 1, IntegerMaxBits);
const getNumberBitsCountForBase = (count: number, base: number): number => getBitsForEnumArrayCountOfBase(count, base);
const getEnumArrayBase = (enumArrayData: EnumArrayData): number => enumArrayData.max - enumArrayData.min + 1;

const getCount = (enumArrayData: EnumArrayData, bitString: string): number => {
  const countBits = getCountBitsCount(enumArrayData);
  if (countBits === 0) return enumArrayData.minCount;
  return rawIntParser(bitString.slice(0, countBits), countBits) + enumArrayData.minCount;
};

export const getBitsCount = (enumArrayData: EnumArrayData, bitString: string): number => {
  const countBits = getCountBitsCount(enumArrayData);
  const count = getCount(enumArrayData, bitString);
  const valuesBitCount = getNumberBitsCountForBase(count, getEnumArrayBase(enumArrayData));

  return countBits + valuesBitCount;
};

export const rawParser = (bitString: string, enumArrayData: EnumArrayData): number[] => {
  const countBits = getCountBitsCount(enumArrayData);
  const count = getCount(enumArrayData, bitString);
  const base = getEnumArrayBase(enumArrayData);
  const valuesBitCount = getNumberBitsCountForBase(count, base);

  const value = convertBitStringToArbitraryBase(bitString.slice(countBits, countBits + valuesBitCount), base, count);
  return value.map((v) => v + enumArrayData.min);
};

export const rawStringifier = (value: number[], enumArrayData: EnumArrayData): string => {
  const countBits = getCountBitsCount(enumArrayData);
  const count = value.length;
  const base = getEnumArrayBase(enumArrayData);

  const countBitstring = countBits ? rawIntStringifier(count - enumArrayData.minCount, countBits) : '';

  const enumArrayBitstring = convertArbitraryBaseToBitString(
    value.map((v) => v - enumArrayData.min),
    base
  );

  return countBitstring + enumArrayBitstring;
};
