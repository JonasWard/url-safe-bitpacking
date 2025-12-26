import { EnumArrayData } from '../types/enumArrayData';
import { rawValueParser as rawIntParser } from './parserUtils';
import { rawIntStringifier } from './parserUtils';
import {
  convertArbitraryBaseToBitString,
  convertBitStringToArbitraryBase,
  getBitsForEnumArrayCountOfBase
} from './parserUtils';

const getNumberBitsCountForBase = (count: number, base: number): number => getBitsForEnumArrayCountOfBase(count, base);
const getEnumArrayBase = (enumArrayData: EnumArrayData): number => enumArrayData.max + 1;

const getCount = (enumArrayData: EnumArrayData, bitString: string): number =>
  rawIntParser(bitString.slice(0, enumArrayData.stateBits), enumArrayData.stateBits) + enumArrayData.minCount;

export const getBitsCount = (enumArrayData: EnumArrayData, bitString: string): number => {
  const count = getCount(enumArrayData, bitString);
  const valuesBitCount = getNumberBitsCountForBase(count, getEnumArrayBase(enumArrayData));

  return enumArrayData.stateBits + valuesBitCount;
};

export const getContentBitsCountForValue = (value: number[], enumArrayData: EnumArrayData): number =>
  getNumberBitsCountForBase(value.length, getEnumArrayBase(enumArrayData));

export const rawParser = (enumArrayData: EnumArrayData, bitString: string): [EnumArrayData, string] => {
  const count = getCount(enumArrayData, bitString);
  const base = getEnumArrayBase(enumArrayData);
  const valuesBitCount = getNumberBitsCountForBase(count, base);

  const value = convertBitStringToArbitraryBase(
    bitString.slice(enumArrayData.stateBits, enumArrayData.stateBits + valuesBitCount),
    base,
    count
  );
  return [{ ...enumArrayData, value }, bitString.slice(enumArrayData.stateBits + valuesBitCount)];
};

export const rawStateStringifier = (
  value: number[],
  minCount: EnumArrayData['minCount'],
  stateBits: EnumArrayData['stateBits']
): string => (stateBits ? rawIntStringifier(value.length - minCount, stateBits) : '');

export const rawStringifier = (value: number[], enumArrayData: EnumArrayData): string => {
  const countBitstring = rawStateStringifier(value, enumArrayData.minCount, enumArrayData.stateBits);

  const base = getEnumArrayBase(enumArrayData);
  const enumArrayBitstring = convertArbitraryBaseToBitString(value, base);

  return countBitstring + enumArrayBitstring;
};
