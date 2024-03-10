import {
  Nullish,
  OmitType,
  OmitTypeMayBe,
  PickTypeMayBe,
} from "../types/utils";

/**
 * Construct a type with the properties of T, making nullable properties optional, excluding null values, and omitting properties that can only be null or undefined.
 */
export type Pruned<T> = OmitType<
  {
    [K in keyof PickTypeMayBe<T, Nullish>]?: Exclude<T[K], Nullish>;
  } & {
    [K in keyof OmitTypeMayBe<T, Nullish>]: T[K];
  },
  undefined
>;

/**
 * Returns a new object with properties from the passed in object, excluding null or undefined values (pruned).
 */
export function pruneObject<T extends object>(obj: T): Pruned<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  ) as any;
}
