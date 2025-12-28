import { DataEntry, ObjectDataEntry } from '../types';

/**
 * Method that only copies the state and / or value of a data entry (doesn't touches the descriptor)
 * @param d - `DataEntry` to copy
 */
export const getCopy = (d: DataEntry | null): DataEntry | null => {
  if (d === null) return null;
  switch (d.type) {
    case 'VERSION':
    case 'BOOLEAN':
    case 'ENUM':
    case 'INT':
    case 'FLOAT':
      return { ...d };
    case 'ENUM_ARRAY':
      return { ...d, value: [...d.value] };
    case 'OPTIONAL':
      return { ...d, value: getCopy(d.value) };
    case 'ENUM_OPTIONS':
      return { ...d, value: getCopy(d.value) as ObjectDataEntry | null };
    case 'ARRAY':
      return { ...d, value: d.value.map(getCopy) as DataEntry[] };
    case 'OBJECT':
      return { ...d, value: d.value.map(getCopy) as DataEntry[] };
  }
};
