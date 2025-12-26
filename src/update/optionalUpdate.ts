import { OptionalDataEntry, UpdateState } from '../types';
import { validateDataEntry } from './validateUtils';

export const constrainState = (state: OptionalDataEntry['state']): OptionalDataEntry['state'] =>
  state === true ? true : false;

export const updateState: UpdateState<OptionalDataEntry> = (original, state): OptionalDataEntry => {
  original.state = constrainState(state);
  original.value = validateDataEntry(original.descriptor[Number(state)], original.value);

  return original;
};
