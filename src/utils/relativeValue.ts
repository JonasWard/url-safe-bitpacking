import { DataEntry } from '../types/dataEntry';

export const getRelativeValue = (dataEntry: DataEntry): number => {
  switch (dataEntry.type) {
    case 'BOOLEAN':
      return Number(dataEntry.value);
    case 'INT':
    case 'FLOAT':
      return (dataEntry.value - dataEntry.min) / (dataEntry.max - dataEntry.min);
    case 'VERSION':
      return dataEntry.value / (2 ** dataEntry.bits - 1);
    case 'ENUM':
      return dataEntry.value / dataEntry.max;
    case 'ENUM_ARRAY':
      return dataEntry.value.reduce((acc, v) => acc + v, 0) / dataEntry.value.length;
  }
};
