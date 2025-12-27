import { DataType, HasStateBitsDataTypes } from '../enums';
import { dataEntryBitsStringifier, dataEntryBitstringParser, parseBase64ToBits, parseBitsToBase64 } from '../parsers';
import {
  ArrayDataEntry,
  BooleanDataEntry,
  DataEntry,
  EnumArrayDataEntry,
  EnumDataEntry,
  EnumOptionsDataEntry,
  FloatDataEntry,
  IntDataEntry,
  ObjectDataEntry,
  OptionalDataEntry,
  VersionDataEntry,
  UpdateWithValidationTypes,
  UpdateWithStateEntries
} from '../types';
import { constrainValue, validateDataEntry } from '../update';
import { constrainState as constrainStateOptional } from '../update/optionalUpdate';
import { constrainState as constrainStateArray } from '../update/arrayUpdate';
import { constrainState as constrainStateEnumOptions } from '../update/enumOptionsUpdate';
import { rawStateStringifier as enumOptionsStateStringifier } from '../parsers/enumOptionsParser';
import { rawStateStringifier as arrayStateStringifier } from '../parsers/arrayParser';
import { rawStateStringifier as enumArrayStateStringifier } from '../parsers/enumArrayParser';
import { rawStateStringifier as optionalStateStringifier } from '../parsers/optionalParser';
import { StateDescriptorFactoryMethod } from '../factory';

export class StateNode {
  protected parent: StateNode | null; // null means that it is the root node
  protected root: StateNode;
  type: DataType;
  name: string;
  bitstring: string = '';

  constructor(entry: DataEntry, parent: StateNode | null) {
    this.parent = parent;
    this.root = parent ? parent.root : this;

    this.type = entry.type;
    this.name = entry.name;
  }

  updateUpstream = (): void => {
    const newBitstring = this.getBitString();
    if (newBitstring !== this.bitstring) {
      this.bitstring = newBitstring;
      if (this.parent) this.parent.updateUpstream();
    }
  };

  getStateBits = (): string => {
    throw new Error('not implemented for ' + this.type);
  };

  getValueBits = (): string => dataEntryBitsStringifier(this.toDataEntry());

  getBitString = (): string => {
    if (HasStateBitsDataTypes.includes(this.type as (typeof HasStateBitsDataTypes)[number]))
      return this.getStateBits() + this.getValueBits();
    return this.getValueBits();
  };

  getBase64String = (): string => parseBitsToBase64(this.bitstring);

  /**
   * Helper method to get a string representation of the parent of this node
   */
  getParentString = (): string => {
    if (this.parent)
      return `${this.parent.name}
↳${this.name}`;
    else return `root:"${this.getDescription()} - ${this.getBase64String()}"`;
  };

  getChildren = (): (StateNode | null)[] => {
    throw new Error('not implemented for ' + this.type);
  };

  getDescription = (): string => this.name;

  /**
   * Helper method to get the (nested) string representaiton of all the children (and grandchildren) of this node
   */
  getChildrenStrings = (): string[] => {
    const children = this.getChildren();
    if (children.length === 0) return [];
    const strings: string[] = [];
    children.forEach((child, level) => {
      const indent = level < children.length - 1 ? '|   ' : '    ';
      if (child) {
        strings.push(`|→"${child.getDescription()}"`);
        for (const grandchild of child.getChildrenStrings()) strings.push(indent + grandchild);
      } else strings.push(`|→null`);
    });
    return strings;
  };

  toDataEntry = (): DataEntry => {
    throw new Error('not implemented for ' + this.type);
  };

  /**
   * Method to get a string representation with the tree-like view of this node and all of its children
   */
  public toString(): string {
    return `${this.getParentString()}\n${this.getChildrenStrings().join('\n')}`;
  }
}

class SimpleStateNodes<T extends UpdateWithValidationTypes> extends StateNode {
  value: T['value'];
  descriptor: T;

  constructor(entry: T, parent: SpecificTypeNode | null) {
    super(entry, parent);
    this.value = entry.value;
    this.descriptor = entry;
    this.bitstring = this.getBitString();
  }

  getChildren = (): SpecificTypeNode[] => [];
  getDescription = (): string => `${this.name}: ${this.value}`;

  updateValue = (value: T['value']): void => (
    (this.value = constrainValue(this.descriptor, value)), this.updateUpstream()
  );

  updateDescriptor = (entry: T): void => ((this.descriptor = entry), this.updateValue(this.value));

  toDataEntry = (): T => ({
    ...this.descriptor,
    name: this.name,
    value: this.value
  });
}

export class VersionNode extends SimpleStateNodes<VersionDataEntry> {}

export class BooleanNode extends SimpleStateNodes<BooleanDataEntry> {}

export class EnumNode extends SimpleStateNodes<EnumDataEntry> {}

export class IntNode extends SimpleStateNodes<IntDataEntry> {}

export class FloatNode extends SimpleStateNodes<FloatDataEntry> {}

export class EnumArrayNode extends SimpleStateNodes<EnumArrayDataEntry> {
  getStateBits = (): string =>
    enumArrayStateStringifier(this.value, this.descriptor.minCount, this.descriptor.stateBits);
  getDescription = (): string => `${this.name}: [${this.value.map((v) => this.descriptor.mapping[v]).join(', ')}]`;
}

class ComplexStateNodes<T extends UpdateWithStateEntries> extends StateNode {
  state: T['state'];
  descriptor: T;

  constructor(entry: T, parent: SpecificTypeNode | null) {
    super(entry, parent);
    this.state = entry.state;
    this.descriptor = entry;
  }
}

export class OptionalNode extends ComplexStateNodes<OptionalDataEntry> {
  private child: SpecificTypeNode | null = null;

  constructor(entry: OptionalDataEntry, parent: SpecificTypeNode | null) {
    super(entry, parent);
    this.child = this.initializedChild();
    this.bitstring = this.getBitString();
  }

  getChildren = (): (SpecificTypeNode | null)[] => [this.child];

  getStateBits = (): string => optionalStateStringifier(this.state);
  getValueBits = (): string => (this.child ? this.child.bitstring : '');

  private initializedChild = (): SpecificTypeNode | null =>
    this.descriptor.descriptor[this.state ? 1 : 0]
      ? NodeFactory(this.descriptor.descriptor[this.state ? 1 : 0]!, this)
      : null;

  updateState = (newState: OptionalDataEntry['state']): void => {
    const constrainedNewState = constrainStateOptional(newState);
    if (this.state === constrainedNewState) return;
    this.state = constrainedNewState;
    this.child = this.descriptor.descriptor[this.state ? 1 : 0]
      ? NodeFactory(this.descriptor.descriptor[this.state ? 1 : 0]!, this)
      : null;
    this.updateUpstream();
  };

  updateDescriptor = (entry: OptionalDataEntry): void => {
    this.descriptor = entry;
    this.child = this.initializedChild();
    this.updateUpstream();
  };

  toDataEntry = (): OptionalDataEntry => ({
    ...this.descriptor,
    name: this.name,
    state: this.state,
    value: this.child ? this.child.toDataEntry() : null
  });

  getDescription = (): string => `${this.name}: ${this.state}`;
}

export class EnumOptionsNode extends ComplexStateNodes<EnumOptionsDataEntry> {
  private child: SpecificTypeNode | null = null;

  constructor(entry: EnumOptionsDataEntry, parent: SpecificTypeNode | null) {
    super(entry, parent);
    this.child = this.initializedChild();
    this.bitstring = this.getBitString();
  }

  getChildren = (): (SpecificTypeNode | null)[] => [this.child];

  getStateBits = (): string => enumOptionsStateStringifier(this.state, this.descriptor.stateBits);
  getValueBits = (): string => (this.child ? this.child.bitstring : '');

  private initializedChild = (): SpecificTypeNode | null => {
    const validatedEntry = validateDataEntry(this.descriptor.descriptor[this.state], this.descriptor.value);
    return validatedEntry ? NodeFactory(validatedEntry, this) : null;
  };

  updateState = (newState: EnumOptionsDataEntry['state']): void => {
    const constrainedNewState = constrainStateEnumOptions(this.descriptor.descriptor.length, newState);
    if (constrainedNewState === this.state) return;
    const validationResult = validateDataEntry(
      this.descriptor.descriptor[constrainedNewState],
      this.child ? this.child.toDataEntry() : null
    );
    this.child = validationResult ? NodeFactory(validationResult, this) : null;
    this.state = constrainedNewState;
    this.updateUpstream();
  };

  updateDescriptor = (entry: EnumOptionsDataEntry): void => {
    this.descriptor = entry;
    this.child = this.initializedChild();
    this.updateUpstream();
  };

  toDataEntry = (): EnumOptionsDataEntry => ({
    ...this.descriptor,
    name: this.name,
    state: this.state,
    value: this.child ? this.child.toDataEntry() : null
  });

  getDescription = () => `${this.name}: ${this.state} of ${this.descriptor.mapping.length} options`;
}

export class ArrayNode extends ComplexStateNodes<ArrayDataEntry> {
  private children: SpecificTypeNode[];

  constructor(entry: ArrayDataEntry, parent: SpecificTypeNode | null) {
    super(entry, parent);
    this.children = this.initializedChildren();
    this.bitstring = this.getBitString();
  }

  // ToDo also handle count of children
  private initializedChildren = (): SpecificTypeNode[] =>
    this.descriptor.value.map((entry) => NodeFactory(validateDataEntry(this.descriptor.descriptor, entry)!, this));

  getChildren = (): SpecificTypeNode[] => this.children;

  getStateBits = (): string => arrayStateStringifier(this.state, this.descriptor.minCount, this.descriptor.stateBits);
  getValueBits = (): string => this.children.map((child) => child.bitstring).join('');

  updateDescriptor = (entry: ArrayDataEntry): void => {
    this.descriptor = entry;
    this.children = this.initializedChildren();
    this.updateUpstream();
  };

  updateState = (newState: ArrayDataEntry['state']): void => {
    const constrainedNewState = constrainStateArray(newState, this.descriptor.minCount, this.descriptor.maxCount);
    if (constrainedNewState === this.state) return;
    if (constrainedNewState < this.state) this.children = this.children.slice(0, constrainedNewState);
    else
      for (let i = this.state; i < constrainedNewState; i++)
        this.children.push(NodeFactory(this.descriptor.descriptor, this));
    this.state = constrainedNewState;
    this.updateUpstream();
  };

  toDataEntry = (): ArrayDataEntry => ({
    ...this.descriptor,
    name: this.name,
    value: this.children.map((child) => child.toDataEntry()),
    state: this.state
  });

  getDescription = (): string =>
    `${this.name}: ${this.state} of (${this.descriptor.minCount}, ${this.descriptor.maxCount})`;
}

export class ObjectNode extends StateNode {
  descriptor: ObjectDataEntry;
  private children: SpecificTypeNode[];

  constructor(entry: ObjectDataEntry, parent: SpecificTypeNode | null) {
    super(entry, parent);
    this.descriptor = entry;
    this.children = this.initializedChild();
    this.bitstring = this.getBitString();
  }

  private initializedChild = (): SpecificTypeNode[] => this.descriptor.value.map((child) => NodeFactory(child, this));

  updateDescriptor = (entry: ObjectDataEntry): void => {
    this.descriptor = entry;
    this.children = this.initializedChild();
    this.updateUpstream();
  };

  getChildren = (): SpecificTypeNode[] => this.children;

  getStateBits = (): string => '';
  getValueBits = (): string => this.children.map((child) => child.bitstring).join('');

  toDataEntry = (): ObjectDataEntry => ({
    ...this.descriptor,
    name: this.name,
    value: this.children.map((child) => child.toDataEntry())
  });
}

const StateNodeMap = {
  VERSION: VersionNode,
  BOOLEAN: BooleanNode,
  ENUM: EnumNode,
  INT: IntNode,
  FLOAT: FloatNode,
  ENUM_ARRAY: EnumArrayNode,
  OPTIONAL: OptionalNode,
  ENUM_OPTIONS: EnumOptionsNode,
  ARRAY: ArrayNode,
  OBJECT: ObjectNode
};

export type StateNodeTypeMap = {
  VERSION: VersionNode;
  BOOLEAN: BooleanNode;
  ENUM: EnumNode;
  INT: IntNode;
  FLOAT: FloatNode;
  ENUM_ARRAY: EnumArrayNode;
  OPTIONAL: OptionalNode;
  ENUM_OPTIONS: EnumOptionsNode;
  ARRAY: ArrayNode;
  OBJECT: ObjectNode;
};

export type SpecificTypeNode = StateNodeTypeMap[keyof StateNodeTypeMap];

export const NodeFactory = <T extends DataType>(
  entry: DataEntry & { type: T },
  parent: SpecificTypeNode | null
): StateNodeTypeMap[T] => new (StateNodeMap[entry.type] as any)(entry, parent);

export const GetStateNodeTree = (entries: [VersionDataEntry, ...DataEntry[]], name?: string): ObjectNode =>
  new ObjectNode(StateDescriptorFactoryMethod(entries, name), null);

export const FromState = (
  stateDescriptor: [VersionDataEntry, ...DataEntry[]],
  name: string,
  base64String: string
): ObjectNode => {
  const bitstring = parseBase64ToBits(base64String);
  const dataObject = StateDescriptorFactoryMethod(stateDescriptor, name);
  const [parsedObject] = dataEntryBitstringParser(dataObject, bitstring);
  return new ObjectNode(parsedObject, null);
};
