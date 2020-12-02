export type ValueOf<T> = T[keyof T];

export const never = (v: never): never => {
  throw new Error(`Expected never, got: ${v}`);
};
