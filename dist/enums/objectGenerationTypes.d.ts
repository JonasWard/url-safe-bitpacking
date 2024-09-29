export declare enum ObjectGenerationOutputStatus {
    DEFAULT = 0,// means that a default value was used to create the object
    FROM_TYPE = 1,// means that the object was created from a type entry (non undefined input)
    PARSED = 2,// means that the object was created by parsing a string
    ERROR_PARSING = 3
}
