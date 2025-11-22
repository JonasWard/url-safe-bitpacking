import { NestedData } from '@/types';
import { StateDataObject } from '@/types/stateDataEntry';

export const getStateData = (state: NestedData) => {
  const object: StateDataObject = {};
  state.forEach((item) => {
    switch (item.type) {
      case 'BOOLEAN':
        object[item.name] = item.value;
        break;
      case 'INT':
        object[item.name] = item.value;
        break;
      case 'ENUM':
        object[item.name] = item.mapping[item.value];
        break;
      case 'FLOAT':
        object[item.name] = item.value;
        break;
      case 'VERSION':
        object[item.name] = item.value;
        break;
      case 'ENUM_ARRAY':
        object[item.name] = item.value.map((v) => item.mapping[v]);
        break;
      case 'OPTIONAL':
        object[item.name] = item.value === null ? null : getStateData(item.value);
        break;
      case 'ENUM_OPTIONS':
        object[item.name] = {
          ...getStateData(item.value),
          state: item.state
        };
        break;
      case 'ARRAY':
        object[item.name] = item.value.map(getStateData);
        break;
    }
  });
  return object;
};
