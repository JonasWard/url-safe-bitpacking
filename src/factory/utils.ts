/**
 * Method to get the max and mapping from the options
 * @param options - `any[] | string | number` the options to get the max and mapping from
 * @returns `{ max: number; mapping: any[] }` the max and mapping
 */
export const getOptionsFromEnumOptions = (
  options: (string | number | object)[] | string | number
): { max: number; mapping: (string | number | object)[] } => {
  if (typeof options === 'string') return { max: options.length - 1, mapping: options.split(',').map(Number) };
  if (typeof options === 'number') return { max: options, mapping: Array.from({ length: options + 1 }, (_, i) => i) };
  return { max: options.length - 1, mapping: options };
};
