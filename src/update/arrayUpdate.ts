import { ArrayDataEntry, DataEntry } from '../types';
import { UpdateState } from '../types/updateType';
import { constrainSignedInt } from './updateUtils';
import { validateDataEntry } from './validateUtils';

export const constrainState = (
  state: ArrayDataEntry['state'],
  minCount: ArrayDataEntry['minCount'],
  maxCount: ArrayDataEntry['maxCount']
): ArrayDataEntry['state'] => constrainSignedInt(state, minCount, maxCount);

export const updateState: UpdateState<ArrayDataEntry> = (original, state, current): ArrayDataEntry => {
  // if state of the update is not within the acceptable range in the original, just return the original
  const updatedState = constrainState(state, original.minCount, original.maxCount);
  const currentValue = current ?? original.value;
  const value = [...new Array(updatedState)].map((_, i) =>
    currentValue[i]
      ? (validateDataEntry(original.descriptor, currentValue[i] ?? null) as DataEntry)
      : original.descriptor
  );

  return {
    ...original,
    state: updatedState,
    value
  };
};
