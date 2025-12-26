import { IntDataEntry } from '../types/dataEntry';
import { constrainSignedInt } from './updateUtils';

export const constrainValue = <T extends IntDataEntry>(original: T, update: T['value']): T['value'] =>
  constrainSignedInt(update, original.min, original.max);

export const updateValue = <T extends IntDataEntry>(original: T, update: T['value']): T => (
  (original.value = constrainValue(original, update)), original
);
