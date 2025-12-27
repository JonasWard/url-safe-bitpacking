# url-safe-bitpacking

Package for creating definitions of parametric models that can be stored as compactly as possible in a URL by storing it in a web-safe base-64 string. This pacakge is till very much WIP. Feel free to suggest by making an issue or pull-request [GitHub](https://github.com/JonasWard/url-safe-bitpacking).

### goal for 1.0

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

# Types defined in `url-safe-bitpacking`
`url-safe-bitpacking` stores the state of an object according to its definition (`descriptor`) into memory (for now using a `bitstring`, a string consisting of `0` and `1`s, parsed into a `base64` string). Attributes of the object are packed according to their specific `bitwidths`, the amount of bits they take up in memory.

From a memory footprint perspective there are two types of attributes in an object defintion. Those that have a definition that gives them a `fixed` bitwidth and those that have a `variable` bitwidth. For the **variable** ones the state of its value will have an impact on the memory footprint of the object. For the **fixed** types, their definition defines their memory footprint. Some of the objects with a **variable** footprint have some state to them, which informs how the state should be parsed. The size of this state is defined by the **descriptor** of the object.

|                          | VERSION     | BOOLEAN     | ENUM        | INT         | FLOAT       | ENUM_ARRAY     | OPTIONAL     | ENUM_OPTIONS     | ARRAY       | OBJECT      |
| ------------------------ | ----------- | ----------- | ----------- | ----------- | ----------- | -------------- | ------------ | ---------------- | ----------- | ----------- |
| Predefined Bitwidth      | **&check;** | **&check;** | **&check;** | **&check;** | **&check;** | &cross;        | &cross;      | &cross;          | &cross;     | &cross;     |
| Has State Bit            | &cross;     | &cross;     | &cross;     | &cross;     | &cross;     | **&check;**    | **&check;**  | **&check;**      | **&check;** | &cross;     |
| Min Bitwidth             | `4`         | `1`         | `1`         | `0`         | `0`         | `1`            | –            | –                | –           | –           |
| Max Bitwidth             | `10`        | `1`         | `8`        | `10`        | `21`        | `8`           | –            | –                | –           | –           |
| Min State Bitwidth       | –           | –           | –           | –           | –           | `0`            | `1`          | `1`              | `0`         | –           |
| Max State Bitwidth       | –           | –           | –           | –           | –           | `10`           | `1`          | `10`             | `10`        | –           |
| Max Available States     | `1024`      | `2`         | `256`      | `1024`   | `2097152`   | `1024 x 256`  | `2`          | `256`           | `1024`      | -         |
| Has Mapping              | &cross;     | &cross;     | **&check;** | &cross;     | &cross;     | **&check;**    | &cross;      | **&check;**      | &cross;     | &cross;     |
| Has Nested Objects       | &cross;     | &cross;     | &cross;     | &cross;     | &cross;     | &cross;        | **&check;**  | **&check;**      | **&check;** | **&check;** |
| **UPDATING**             | **VERSION** | **BOOLEAN** | **ENUM**    | **INT**     | **FLOAT**   | **ENUM_ARRAY** | **OPTIONAL** | **ENUM_OPTIONS** | **ARRAY**   | **OBJECT**  |
| Requires Value on Update | **&check;** | **&check;** | **&check;** | **&check;** | **&check;** | **&check;**    | **&cross;**  | **&cross;**      | **&cross;** | **&cross;** |
| Requires State on Update | –           | –           | –           | –           | –           | **&cross;**    | **&check;**  | **&check;**      | **&check;** | –           |

# Install

```bash
npm install url-safe-bitpacking
yarn install url-safe-bitpacking
bun install url-safe-bitpacking
```
