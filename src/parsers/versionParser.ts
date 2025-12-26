import { VersionData } from '../types/versionData';
import { rawValueParser as rawIntParser } from './parserUtils';
import { rawIntStringifier } from './parserUtils';

export const getBitsCount = (versionData: VersionData): number => versionData.bits;

export const rawParser = (rawString: string, versionData: VersionData): number => rawIntParser(rawString, versionData.bits);

export const rawStringifier = (value: number, versionData: VersionData): string => {
  if (value > 2 ** versionData.bits - 1) throw new Error('Version exceeds max');
  return rawIntStringifier(value, versionData.bits);
};
