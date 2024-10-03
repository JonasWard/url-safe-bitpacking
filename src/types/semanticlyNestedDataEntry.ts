import { DataEntry } from './dataEntry';

export type SemanticlyNestedDataEntry = {
  [key: string]: SemanticlyNestedDataEntry | DataEntry;
};
