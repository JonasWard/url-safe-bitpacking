# url-safe-bitpacking

Package for creating definitions of parametric models that can be stored as compactly as possible in a URL by storing it in a web-safe base-64 string.

## concept

The goal of this library is to offer a flexible, minimal and, variable object definition that can be stored in the browser URL. The main imagined use-case is parametric models that have nested and variable sub-object definitions.

The library heavily relies on the bitpacking of custom bitwidth numeric values. Because of that, the biggest trade-off for this library is legibility. Without the related object definition, it would be impossible to reconstruct the state.

The big advantage though is the ability to store rather many variables in a very condensed URL, allowing to store all information in rather short urls which then can be used for qr code generation.

## data types

Currently, there are 4 data types implemented (+1 special case for safety). All data entries have a name that will behave as an attribute name in the object.

### bool

Bool type values are simple yes or no, 1 or 0s, nothing special

```typescript
DataEntryFactory.createBoolean(false, 'shapePreProcessingWarpabsolute');
```

### enum

An enum in this context is a continuous array of integers. The Bitwidth of this data type is defined by the maximum entry. eg. in case you you would need 21 states, the larges value would be 20. The value 20 would require at least five bits (log2(20) ~ 4.32). The maximum bitwidth for enums is right now hardcoded to 8-bit (which would be the range [0, 255] ).

```typescript
DataEntryFactory.createEnum(0, 3, 'footprintType');
```

### int

An int type is rather similar to the enum, except that it starts at a specific minimum value. The range that then needs to be able to be stored is: max - min. In case you would need values from -30 to 10, you would have to be able to store 10 - 30 + 1 = 51 states. This would require a bitwidth of 6 (log2(51) ~ 5.67). The max bitwidth is now hardcoded to be 12 (which would be the range [minimum, 4095 - minimum])

```typescript
DataEntryFactory.createInt(5, 3, 20, 'circleDivisions');
```

### float

Floating points work very much like the integer type, with the main difference that one can also define a precision to define at what order of magnitude (from -3 to +3) the variable should be considered. The significand can be up to 20 bits, which eg. at precision -3 would allow a range of .001 to 1048.576. Floating points are assumed to be always positive.

```typescript
DataEntryFactory.createFloat(20, 10, 200, -1, 'shapePreProcessingWarptotal');
```

### version

There is also a Version object which is a special case of the enum data type and has a bitwidth of 4, 6, 8 or, 10 and always occupies the first bits of the bitarray.

```typescript
DataEntryFactory.createVersion(0, 8, 'version');
```

## attribute map

On a macro level there are two types of data. Either Single Level array objects or Double Nested array objects.

Single-level nested objects are arrays in which the entries it contains describe themselves. The Double Nested arrays describe objects that will have a variable size, that depends on the linked data entry that is selected is set in state.

For the Double Nested arrays there are currently two variations: either an Optional type, which only accepts two values of which is an empty array and will be toggle on/off in relation to a certain boolean data entry.

Install

```bash
npm install url-safe-bitpacking
yarn install url-safe-bitpacking
bun install url-safe-bitpacking
```
