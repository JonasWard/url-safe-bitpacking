import { DataEntry } from './dataEntry';

export type SemanticlyNestedDataEntry = {
  [key: string]: SemanticlyNestedDataEntry | DataEntry | SemanticlyNestedDataEntry[];
};

export type SemanticlyNestedValues = {
  [key: string]: SemanticlyNestedValues | number | string | boolean | SemanticlyNestedValues[];
};
