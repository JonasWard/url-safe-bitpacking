import { FloatDataEntry } from '../types/dataEntry';
import { constrainFloat } from './updateUtils';

export const constrainValue = <T extends FloatDataEntry>(original: T, update: T['value']): T['value'] =>
  constrainFloat(update, original.min, original.max, original.precision);

export const updateValue = <T extends FloatDataEntry>(original: T, update: T['value']): T => (
  (original.value = constrainValue(original, update)), original
);
