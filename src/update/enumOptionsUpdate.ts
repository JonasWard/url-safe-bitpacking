import { EnumOptionsDataEntry, UpdateState } from '../types';
import { constrainUnsignedInt } from './updateUtils';
import { validateDataEntry } from './validateUtils';

export const constrainState = (descriptorLength: EnumOptionsDataEntry['descriptor']['length'], state: number): number =>
  constrainUnsignedInt(state, descriptorLength - 1);

export const updateState: UpdateState<EnumOptionsDataEntry> = (original, state, current): EnumOptionsDataEntry => {
  const updatedState = constrainState(original.descriptor.length, state);
  const value = validateDataEntry(
    original.descriptor[updatedState],
    current ?? original.value
  ) as EnumOptionsDataEntry['value'];

  return { ...original, state: updatedState, value };
};
