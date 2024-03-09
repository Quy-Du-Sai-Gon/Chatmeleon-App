import {
  Nullish,
  OmitType,
  OmitTypeMayBe,
  PickTypeMayBe,
} from "../types/utils";

export type Pruned<T> = OmitType<
  {
    [K in keyof PickTypeMayBe<T, Nullish>]?: Exclude<T[K], Nullish>;
  } & {
    [K in keyof OmitTypeMayBe<T, Nullish>]: T[K];
  },
  undefined
>;

export function pruneObject<T extends object>(obj: T): Pruned<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  ) as any;
}
