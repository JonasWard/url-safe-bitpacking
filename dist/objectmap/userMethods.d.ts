import { EnumSemantics, VersionHandler, VersionContentDefinition } from '../types';
/**
 * Method to create version definition objects
 * @param {VersionArrayDefinitionType[]} versionContent  - version definition array
 * @param {number} maximumExpectedVersions - maximum expected versions to define
 * @param {number} defaultVersion - number - optional, default it is the first,
 * @param {EnumSemantics[] | EnumSemantics} enumSemanticsMapping - optional - UI semantics mapping for enums. If not given, values will be numbers
 * @param {undefined | Record<string, string> | Record<string, string>[]} attributeSemanticsMapping - optional - UI semantics mapping, if nothing given no semantics will be mapped
 * @param {number[]} exposedVersions?: number[] - optional - UI semantics, masks which objects to show and hide
 * @returns ParsersForVersionObject
 */
export declare const createParserObject: (versionContent: VersionContentDefinition, maximumExpectedVersions: number, defaultVersion?: number, enumSemanticsMapping?: EnumSemantics | EnumSemantics[], attributeSemanticsMapping?: Record<string, string> | Record<string, string>[], exposedVersions?: number[]) => VersionHandler;
