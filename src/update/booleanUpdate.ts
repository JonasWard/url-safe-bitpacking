import { BooleanDataEntry } from '../types/';

export const constrainValue = <T extends BooleanDataEntry>(original: T, update: T['value']): T['value'] =>
  update === true ? true : false;

export const updateValue = <T extends BooleanDataEntry>(original: T, update: T['value']): T => (
  (original.value = constrainValue(original, update)), original
);
