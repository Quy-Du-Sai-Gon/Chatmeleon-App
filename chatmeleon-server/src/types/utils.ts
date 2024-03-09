export type PickTypeMayBe<T, U> = {
  [P in keyof T as U extends T[P] ? P : never]: T[P];
};

export type OmitTypeMayBe<T, U> = Omit<T, keyof PickTypeMayBe<T, U>>;

export type PickType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

export type OmitType<T, U> = Omit<T, keyof PickType<T, U>>;

export type Nullish = null | undefined;
