import { DataType } from '../enums/dataTypes';
import { dataEntryCorrecting } from '../parsers/parsers';
import { DataEntry } from '../types/dataEntry';

/**
 * helper method to interpolate a data entry at a given t parameter
 * @param dataEntry - DataEntry to interpolate
 * @param t - number between 0 and 1
 * @returns updated data entry
 */
export const interpolateEntryAt = (dataEntry: DataEntry, t: number) => {
  const localT = Math.max(Math.min(1, t), 0);
  const cosT = Math.cos(localT * 2 * Math.PI) * 0.5 + 0.5;

  switch (dataEntry.type) {
    case DataType.BOOLEAN:
      return { ...dataEntry, value: Boolean(Math.round(localT)) };
    case DataType.VERSION:
      return { ...dataEntry, value: Math.floor(localT * (dataEntry.bits ** 2 - 0.001)) };
    case DataType.ENUM:
      return { ...dataEntry, value: Math.floor(localT * (dataEntry.max + 0.999)) };
    case DataType.INT:
      return { ...dataEntry, value: dataEntry.min + Math.floor(cosT * (dataEntry.max - dataEntry.min + 0.999)) };
    case DataType.FLOAT:
      const v = dataEntry.min + cosT * (dataEntry.max - dataEntry.min);
      return dataEntryCorrecting({ ...dataEntry, value: Math.min(dataEntry.max, Math.max(v, dataEntry.min)) });
  }
};
