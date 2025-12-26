# Types defined in `url-safe-bitpacking`

`url-safe-bitpacking` stores the state of an object according to its definition (`descriptor`) into memory (for now using a `bitstring`, a string consisting of `0` and `1`s, parsed into a `base64` string). Attributes of the object are packed according to their specific `bitwidths`, the amount of bits they take up in memory.

From a memory footprint perspective there are two types of attributes in an object defintion. Those that have a definition that gives them a `fixed` bitwidth and those that have a `variable` bitwidth. For the **variable** ones the state of its value will have an impact on the memory footprint of the object. For the **fixed** types, their definition defines their memory footprint. Some of the objects with a **variable** footprint have some state to them, which informs how the state should be parsed. The size of this state is defined by the **descriptor** of the object.

|                          | VERSION     | BOOLEAN     | ENUM        | INT         | FLOAT       | ENUM_ARRAY     | OPTIONAL     | ENUM_OPTIONS     | ARRAY       | OBJECT      |
| ------------------------ | ----------- | ----------- | ----------- | ----------- | ----------- | -------------- | ------------ | ---------------- | ----------- | ----------- |
| Predefined Bitwidth      | **&check;** | **&check;** | **&check;** | **&check;** | **&check;** | &cross;        | &cross;      | &cross;          | &cross;     | &cross;     |
| Has State Bit            | &cross;     | &cross;     | &cross;     | &cross;     | &cross;     | **&check;**    | **&check;**  | **&check;**      | **&check;** | &cross;     |
| Min Bitwidth             | `4`         | `1`         | `1`         | `0`         | `0`         | `1`            | –            | –                | –           | –           |
| Max Bitwidth             | `10`        | `1`         | `10`        | `21`        | `21`        | `10`           | –            | –                | –           | –           |
| Min State Bitwidth       | –           | –           | –           | –           | –           | `0`            | `1`          | `1`              | `0`         | –           |
| Max State Bitwidth       | –           | –           | –           | –           | –           | `10`           | `1`          | `10`             | `10`        | –           |
| Max Available States     | `1024`      | `2`         | `1024`      | `2097152`   | `2097152`   | `1024 x 1024`  | `2`          | `1024`           | `1024`      | `0`         |
| Has Mapping              | &cross;     | &cross;     | **&check;** | &cross;     | &cross;     | **&check;**    | &cross;      | **&check;**      | &cross;     | &cross;     |
| Has Nested Objects       | &cross;     | &cross;     | &cross;     | &cross;     | &cross;     | &cross;        | **&check;**  | **&check;**      | **&check;** | **&check;** |
| **UPDATING**             | **VERSION** | **BOOLEAN** | **ENUM**    | **INT**     | **FLOAT**   | **ENUM_ARRAY** | **OPTIONAL** | **ENUM_OPTIONS** | **ARRAY**   | **OBJECT**  |
| Requires Value on Update | **&check;** | **&check;** | **&check;** | **&check;** | **&check;** | **&check;**    | **&cross;**  | **&cross;**      | **&cross;** | **&cross;** |
| Requires State on Update | –           | –           | –           | –           | –           | **&cross;**    | **&check;**  | **&check;**      | **&check;** | –           |
