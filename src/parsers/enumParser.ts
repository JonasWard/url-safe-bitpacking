import { EnumData } from '../types/enumData';
import { rawValueParser as rawIntParser } from './parserUtils';
import { rawIntStringifier } from './parserUtils';

export const getBitsCount = (enumData: EnumData): number => enumData.bits;

export const rawParser = (rawString: string, enumData: EnumData): number => rawIntParser(rawString, enumData.bits);

export const rawStringifier = (value: number, enumData: EnumData): string => {
  if (value > enumData.max) throw new Error('Version exceeds max');
  return rawIntStringifier(value, enumData.bits);
};
