//#region CollapsedUnion
// Source: https://stackoverflow.com/questions/65750673

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// This utility lets T be indexed by any key
type Indexify<T> = T & { [str: string]: undefined };

// To make a type where all values are undefined, so that in AllUnionKeys<T>
// TS doesn't remove the keys whose values are incompatible, e.g. string & number
type UndefinedVals<T> = { [K in keyof T]: undefined };

// This returns a union of all keys present across all members of the union T
type AllUnionKeys<T> = keyof UnionToIntersection<UndefinedVals<T>>;

/**
 * Used to collapse discriminated unions into a single type.
 */
export type CollapsedUnion<T> = {
  [K in AllUnionKeys<T> & string]: Indexify<T>[K];
};

//#endregion
