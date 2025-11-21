import { NestedData } from './dataEntry';

export type OptionalData = {
  type: 'OPTIONAL';
  state: boolean;
  descriptor: [NestedData, null] | [null, NestedData];
  value: NestedData | null;
};
