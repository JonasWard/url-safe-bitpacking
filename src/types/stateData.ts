export type StateDataObjectValue = object | string | number | number[] | boolean | null | StateDataObject;
export type StateDataObject = {
  [key: string]: StateDataObjectValue;
};
