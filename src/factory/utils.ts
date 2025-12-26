import { EnumMappingType, EnumOptionsType } from '../types';

/**
 * Method to get the max and mapping from the options
 * @param options - `any[] | string | number` the options to get the max and mapping from
 * @returns `{ max: number; mapping: any[] }` the max and mapping
 */
export const getEnumMaxAndMappingFromOptions = (
  options: EnumOptionsType
): { max: number; mapping: EnumMappingType } => {
  if (typeof options === 'string') return { max: options.length - 1, mapping: options.split('') };
  if (typeof options === 'number') return { max: options, mapping: Array.from({ length: options + 1 }, (_, i) => i) };
  return { max: options.length - 1, mapping: options };
};

/**
 * Method to get the options from the max and mapping of an ENUM & ENUM_ARRAY type
 * @param v - `{ max: number; mapping: EnumMappingType }` the max and mapping to get the options from
 * @returns `EnumOptionsType` the options
 */
export const getOptionsFromMaxAndMapping = (v: { max: number; mapping: EnumMappingType }): EnumOptionsType => {
  if (v.mapping.every((option) => typeof option === 'string' && option.length === 1)) return v.mapping.join('');
  if (Array.from({ length: v.max + 1 }, (_, i) => i).every((option, i) => option === v.mapping[i])) return v.max;

  return v.mapping;
};
