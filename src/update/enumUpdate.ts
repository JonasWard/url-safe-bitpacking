import { EnumDataEntry } from '../types/dataEntry';
import { constrainUnsignedInt } from './updateUtils';

export const constrainValue = <T extends EnumDataEntry>(original: T, update: T['value']): T['value'] =>
  constrainUnsignedInt(update, original.max);

export const updateValue = <T extends EnumDataEntry>(original: T, update: T['value']): T => (
  (original.value = constrainValue(original, update)), original
);
