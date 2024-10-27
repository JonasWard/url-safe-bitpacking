import { ObjectGenerationOutputStatus } from '../enums/objectGenerationTypes';
import { DataEntry, VersionDataEntry } from './dataEntry';
import { SemanticlyNestedDataEntry } from './semanticlyNestedDataEntry';
import { VersionRangeType } from './versionData';

/**
 * A method that generates a nested object based on a set of values
 * @param s - url bit string (optional)
 * @param v - The values to be used to generate the object, can be either a valid value for a dataentry, a bitstring (only 0 or 1 chars) or undefined (default value)
 * @returns [The generated object, the generation status, the index end bit of the bit url (-1 if)]
 */
export type ObjectGeneratorMethod = (s?: string, ...v: (DataEntry | undefined)[]) => [SemanticlyNestedDataEntry, ObjectGenerationOutputStatus, number];

export type DefinitionDerivativeMethod = (v: DataEntry) => {
  s: DataEntry;
  v: DefinitionArrayObject;
};
export type DefinitionNestedArray = [string, DefinitionArrayObject];
export type DefinitionDerivativeObject = [string, DataEntry, DefinitionDerivativeMethod];
export type DefinitionSubObject = DataEntry | DefinitionNestedArray | DefinitionDerivativeObject;
export type DefinitionArrayObject = DefinitionSubObject[];
export type VersionDefinitionObject = [VersionDataEntry, ...DefinitionArrayObject];

export type VersionEnumSemantics = {
  [key: string]: { value: number; label: string }[];
};

export type ParserForVersion = {
  enumSemanticsMapping?: VersionEnumSemantics;
  attributeSemanticsMapping?: Record<string, string>;
  objectGeneratorParameters: VersionDefinitionObject;
};

export type ParsersForVersionObject = {
  versionBitCount: VersionRangeType;
  parsers: ParserForVersion[];
};
