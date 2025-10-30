# url-safe-bitpacking

Package for creating definitions of parametric models that can be stored as compactly as possible in a URL by storing it in a web-safe base-64 string. This pacakge is till very much WIP. Feel free to suggest by making an issue or pull-request [GitHub](https://github.com/JonasWard/url-safe-bitpacking).

### goal for version 0.2

| what                                                 | code     | tests    | docs     |
| ---------------------------------------------------- | -------- | -------- | -------- |
| data types                                           | &check;  | &check;  | &check;  |
| nested object model                                  | &check;  | &check;  | &frac14; |
| updating model entries                               | &check;  | &check;  |          |
| re-using data from old model on change in definition | &frac12; | &frac14; |          |
| flattening and reading of the objects                | &check;  | &check;  | &iquest; |
| arrays (both bit-level as arrays of objects)         | &frac12; | &frac12; |          |
| utility to create StateValueType                     |          |          |          |
| ability to migrate one version to another            |          |          |          |

## concept

The goal of this library is to offer a flexible, minimal and, variable object definition that can be stored in the browser URL. The main imagined use-case is parametric models that have nested and variable sub-object definitions. The library heavily relies on the bitpacking of custom bitwidth numeric values. Because of that, the biggest trade-off for this library is legibility. Without the related object definition, it would be impossible to reconstruct the state. The big advantage though is the ability to store rather many variables in a very condensed URL, allowing to store all information in rather short urls which then can be used for qr code generation.

## bit-level data types

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

Floating points work very much like the integer type, with the main difference that one can also define a precision to define at what order of magnitude (from -3 to +3) the variable should be considered. The significand can be up to 20 bits, which eg. at precision -3 would allow a range of .001 to 1048.576.

```typescript
DataEntryFactory.createFloat(20, 10, 200, -1, 'shapePreProcessingWarptotal');
```

### enum array

Enum arrays are a special type of arrays where integer values are intepreted as being values of a **specific base** to then be transformed to base 2. The base is derived from the delta of the max `and` the `min` value of the enums. Besides that, there is also a `minCount` and `maxCount` value (which can be the same value, but `minCount` is at least 1). This only offers a compression rate of upto 22% vis-a-vis an array of `IntDataEntry` (worst case its 0% percent, it never takes up more space), so sometimes questionable whether it makese sense to use ^^.

```typescript
DataEntryFactory.createEnumArray([0, 1, 2], 0, 10, 3, 5, 'enumArrayA')
```

### version

There is also a Version object which is a special case of the enum data type and has a bitwidth of 4, 6, 8 or, 10 and always occupies the first bits of the bitarray.

```typescript
DataEntryFactory.createVersion(0, 8, 'version');
```

## nested attribute definitions

More often than not in parametric models, certain data belongs together. It can also happen that the specific state of some values will have an impact on other ones being present (or which ranges are allowed). To be able to deal with this there is the option to nest data. I tried to come with an as concise yet versatile way of defining the object definitions.

### single nes

For the Double Nested arrays there are currently two variations: either an Optional type, which only accepts two values of which is an empty array and will be toggle on/off in relation to a certain boolean data entry.

# Install

```bash
npm install url-safe-bitpacking
yarn install url-safe-bitpacking
bun install url-safe-bitpacking
```
