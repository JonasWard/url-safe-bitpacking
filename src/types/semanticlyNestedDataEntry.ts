import { DataEntry } from './dataEntry';

export type SemanticlyNestedDataEntry = {
  [key: string]: SemanticlyNestedDataEntry | DataEntry;
};

export type SemanticlyNestedValues = {
  [key: string]: SemanticlyNestedValues | boolean | number | string;
};
