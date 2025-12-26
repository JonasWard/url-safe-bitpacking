import { VersionDataEntry } from '../types';
import { constrainUnsignedInt } from './updateUtils';

export const constrainValue = <T extends VersionDataEntry>(original: T, update: T['value']): T['value'] =>
  constrainUnsignedInt(update, original.bits ** 2 - 1);

export const updateValue = <T extends VersionDataEntry>(original: T, update: T['value']): T => (
  (original.value = constrainValue(original, update)), original
);
