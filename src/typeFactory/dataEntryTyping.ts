// this file contains methods that create a type file for a given VersionContentDefinition

import { DataType } from '../enums';
import { DataEntry } from '../types';

export const getDataEntryTypeString = (d: DataEntry, withLibraryInformation: boolean = false, retainValue: boolean = false): string => {
  const sInfo = `value: ${retainValue ? d.value : getDataValueType(d)}, name: "${d.name}", `;
  const iInfo = withLibraryInformation ? ` ,internalName: ${d.internalName}, index: ${d.index}` : '';
  switch (d.type) {
    case DataType.BOOLEAN:
      return `{ ${sInfo}type: DataType.BOOLEAN${iInfo} }`;
    case DataType.VERSION:
      return `{ ${sInfo}type: DataType.VERSION, bits: ${d.bits}${iInfo} }`;
    case DataType.ENUM:
      return `{ ${sInfo}type: DataType.ENUM, max: ${d.max}, bits: ${d.bits}${iInfo} }`;
    case DataType.INT:
      return `{ ${sInfo}type: DataType.INT, min: ${d.min}, max: ${d.max}, bits: ${d.bits}${iInfo} }`;
    case DataType.FLOAT:
      return `{ ${sInfo}type: DataType.FLOAT, min: ${d.min}, max: ${d.max}, precision: ${d.precision}, significand: ${d.significand}${iInfo} }`;
  }
};

const getDataValueType = (d: DataEntry): string => (d.type === DataType.BOOLEAN ? 'boolean' : 'number');
const getAttributeName = (d: DataEntry): string => `["${d.name}"]`;

export const getStateDataContentType = (d: DataEntry): string => `${getAttributeName(d)}: ${getDataEntryTypeString(d)}`;
export const getStateValueContentType = (d: DataEntry): string => `${getAttributeName(d)}: ${getDataValueType(d)}`;

const typeNameStringAddition = 'VBEIF';

export const getSafeName = (name: string) => {
  let localName = name.replaceAll(' ', '');
  return localName.charAt(0).toUpperCase() + localName.slice(1);
};

export const getDateEntryTypeNamedString = (d: DataEntry, withLibraryInformation: boolean = false): string =>
  `export type ${typeNameStringAddition[d.type]}${getSafeName(d.name)} = ${getDataEntryTypeString(d, withLibraryInformation)};`;
