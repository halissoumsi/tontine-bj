import { useLayoutEffect, useRef } from "react";

type AnyFunction = (...args: any[]) => any;

/**
 * usePersistFn guarantees a persistent callback reference while always calling the latest fn.
 */
export function usePersistFn<T extends AnyFunction>(fn: T): T {
  const fnRef = useRef<T>(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  const persistFn = useRef<T | null>(null);
  if (!persistFn.current) {
    persistFn.current = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
      return fnRef.current.apply(this, args);
    } as T;
  }

  return persistFn.current;
}
