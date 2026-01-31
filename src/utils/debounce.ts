export const debounceFn = <T extends (...args: never[]) => void>(
  fn: T,
  delayMs = 300,
) => {
  let timeout: number | undefined = undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delayMs);
  };
};
