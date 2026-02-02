interface DebouncedFn<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

export const debounceFn = <T extends (...args: never[]) => void>(
  fn: T,
  delayMs = 300,
): DebouncedFn<T> => {
  let timeout: number | undefined = undefined;

  const debouncedFn: DebouncedFn<T> = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delayMs);
  };

  debouncedFn.cancel = () => {
    clearTimeout(timeout);
  };

  return debouncedFn;
};
