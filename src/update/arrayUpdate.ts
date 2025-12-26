import { ArrayDataEntry, DataEntry } from '../types';
import { UpdateState } from '../types/updateType';
import { constrainSignedInt } from './updateUtils';
import { validateDataEntry } from './validateUtils';

export const constrainState = (
  state: ArrayDataEntry['state'],
  minCount: ArrayDataEntry['minCount'],
  maxCount: ArrayDataEntry['maxCount']
): ArrayDataEntry['state'] => constrainSignedInt(state, minCount, maxCount);

export const updateState: UpdateState<ArrayDataEntry> = (original, state): ArrayDataEntry => {
  // if state of the update is not within the acceptable range in the original, just return the original
  original.state = constrainState(state, original.minCount, original.maxCount);
  original.value = [...new Array(original.state)].map((_, i) =>
    original.value[i]
      ? (validateDataEntry(original.descriptor, original.value[i] ?? null) as DataEntry)
      : original.descriptor
  );

  return original;
};
