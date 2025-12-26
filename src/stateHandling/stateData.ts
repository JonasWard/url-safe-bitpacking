import { DataEntry, StateDataObject, StateDataObjectValue } from '../types';

const getObjectForDataEntries = (entries: DataEntry[]): StateDataObject => {
  const object: StateDataObject = {};
  entries.forEach((item) => {
    object[item.name] = getStateData(item);
  });
  return object;
};

export const getStateData = (entry: DataEntry): StateDataObjectValue => {
  switch (entry.type) {
    case 'BOOLEAN':
    case 'INT':
    case 'FLOAT':
    case 'VERSION':
      return entry.value;
    case 'ENUM':
      return entry.mapping[entry.value];
    case 'ENUM_ARRAY':
      return entry.value.map((v) => entry.mapping[v]);
    case 'OPTIONAL':
      return entry.value === null ? null : getStateData(entry.value);
    case 'ENUM_OPTIONS':
      const state = entry.mapping[entry.state];
      if (entry.value) {
        switch (entry.value.type) {
          case 'OBJECT':
            return {
              ...(getStateData(entry.value) as StateDataObject),
              state
            };
          default:
            return { state, value: getStateData(entry.value) };
        }
      } else return { state };
    case 'OBJECT':
      return getObjectForDataEntries(entry.value);
    case 'ARRAY':
      return entry.value.map((v) => getStateData(v));
  }
};
