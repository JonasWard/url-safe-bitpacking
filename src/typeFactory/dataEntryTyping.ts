// this file contains methods that create a type file for a given VersionContentDefinition

import { DataType } from '../enums';
import { DataEntry } from '../types';

export const getDataEntryTypeString = (
  d: DataEntry,
  withLibraryInformation: boolean = false,
  retainValue: boolean = false
): string => {
  const sInfo = `value: ${retainValue ? d.value : getDataValueType(d)}, name: "${d.name}", `;
  const iInfo = withLibraryInformation ? ` ,internalName: ${d.internalName}, index: ${d.index}` : '';
  switch (d.type) {
    case 'BOOLEAN':
      return `{ ${sInfo}type: "BOOLEAN"${iInfo} }`;
    case 'VERSION':
      return `{ ${sInfo}type: "VERSION", bits: ${d.bits}${iInfo} }`;
    case 'ENUM':
      return `{ ${sInfo}type: "ENUM", max: ${d.max}, bits: ${d.bits}${iInfo} }`;
    case 'INT':
      return `{ ${sInfo}type: "INT", min: ${d.min}, max: ${d.max}, bits: ${d.bits}${iInfo} }`;
    case 'FLOAT':
      return `{ ${sInfo}type: "FLOAT", min: ${d.min}, max: ${d.max}, precision: ${d.precision}, significand: ${d.significand}${iInfo} }`;
    case 'ENUM_ARRAY':
      return `{ ${sInfo}type: "ENUM_ARRAY", minCount: ${d.minCount}, maxCount: ${d.maxCount}, max: ${d.max}, value: ${d.value}${iInfo} }`;
  }
};

const typeNameStringAddition: Record<DataType, string> = {
  VERSION: 'V',
  BOOLEAN: 'B',
  ENUM: 'E',
  INT: 'I',
  FLOAT: 'F',
  ENUM_ARRAY: 'A'
};

const getDataValueType = (d: DataEntry): string =>
  d.type === 'BOOLEAN' ? 'boolean' : d.type === 'ENUM_ARRAY' ? 'number[]' : 'number';
const getAttributeName = (d: DataEntry): string => `["${d.name}"]`;

export const getStateDataContentType = (d: DataEntry): string => `${getAttributeName(d)}: ${getDataEntryTypeString(d)}`;
export const getStateValueContentType = (d: DataEntry): string => `${getAttributeName(d)}: ${getDataValueType(d)}`;

export const getSafeName = (name: string): string => {
  let localName = name.replaceAll(' ', '');
  return localName.charAt(0).toUpperCase() + localName.slice(1);
};

export const getDateEntryTypeNamedString = (d: DataEntry, withLibraryInformation: boolean = false): string =>
  `export type ${typeNameStringAddition[d.type]}${getSafeName(d.name)} = ${getDataEntryTypeString(d, withLibraryInformation)};`;
