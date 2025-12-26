import { EnumOptionsDataEntry, UpdateState } from '../types';
import { constrainUnsignedInt } from './updateUtils';
import { validateDataEntry } from './validateUtils';

export const constrainState = (descriptorLength: EnumOptionsDataEntry['descriptor']['length'], state: number): number =>
  constrainUnsignedInt(state, descriptorLength - 1);

export const updateState: UpdateState<EnumOptionsDataEntry> = (original, state): EnumOptionsDataEntry => {
  original.state = constrainState(original.descriptor.length, state);
  original.value = validateDataEntry(
    original.descriptor[original.state],
    original.value
  ) as EnumOptionsDataEntry['value'];

  return original;
};
