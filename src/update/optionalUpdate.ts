import { OptionalDataEntry, UpdateState } from '../types';
import { validateDataEntry } from './validateUtils';

export const constrainState = (state: OptionalDataEntry['state']): OptionalDataEntry['state'] =>
  state === true ? true : false;

export const updateState: UpdateState<OptionalDataEntry> = (original, state, current): OptionalDataEntry => {
  const updatedState = constrainState(state);
  const value = validateDataEntry(original.descriptor[Number(state)], current ?? original.value);

  return { ...original, state: updatedState, value };
};
