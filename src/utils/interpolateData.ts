import { ConstantBitWidthDataTypes } from '@/enums';
import { dataEntryCorrecting } from '../parsers/parsers';
import { DataEntry } from '../types/dataEntry';

/**
 * helper method to interpolate a data entry at a given t parameter
 * @param dataEntry - DataEntry to interpolate
 * @param t - number between 0 and 1
 * @returns updated data entry
 */
export const interpolateEntryAt: (
  dataEntry: DataEntry & { type: (typeof ConstantBitWidthDataTypes)[number] },
  t: number
) => DataEntry = (
  dataEntry: DataEntry & { type: (typeof ConstantBitWidthDataTypes)[number] },
  t: number
): DataEntry => {
  const localT = Math.max(Math.min(1, t), 0);
  const cosT = Math.cos(localT * 2 * Math.PI) * 0.5 + 0.5;

  switch (dataEntry.type) {
    case 'BOOLEAN':
      return { ...dataEntry, value: Boolean(Math.round(localT)) };
    case 'VERSION':
      return { ...dataEntry, value: Math.floor(localT * (dataEntry.bits ** 2 - 0.001)) };
    case 'ENUM':
      return { ...dataEntry, value: Math.floor(localT * (dataEntry.max + 0.999)) };
    case 'INT':
      return { ...dataEntry, value: dataEntry.min + Math.floor(cosT * (dataEntry.max - dataEntry.min + 0.999)) };
    case 'FLOAT':
      const v = dataEntry.min + cosT * (dataEntry.max - dataEntry.min);
      return dataEntryCorrecting({ ...dataEntry, value: Math.min(dataEntry.max, Math.max(v, dataEntry.min)) });
  }
};
