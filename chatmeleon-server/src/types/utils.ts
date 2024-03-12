/**
 * From T, pick a set of properties whose values can be super types of type U (U extends value).
 */
export type PickTypeMayBe<T, U> = {
  [P in keyof T as U extends T[P] ? P : never]: T[P];
};

/**
 * Construct a type with the properties of T except for those whose values can be super types of type U (U extends value).
 */
export type OmitTypeMayBe<T, U> = Omit<T, keyof PickTypeMayBe<T, U>>;

/**
 * From T, pick a set of properties whose values are subtypes of type U (value extends U).
 */
export type PickType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

/**
 * Construct a type with the properties of T except for those whose values are subtypes of type U (value extends U).
 */
export type OmitType<T, U> = Omit<T, keyof PickType<T, U>>;

/**
 * Nullish value, i.e., null or undefined.
 */
export type Nullish = null | undefined;
