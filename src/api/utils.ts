import { createAbortError } from '~/api/errors';
import { isCancel } from 'axios';

export const wrapAxios = <TOptions, TResult>(
  fn: (options: TOptions, signal?: AbortSignal) => Promise<TResult>,
) => {
  const wrappedFn = async (options: TOptions, signal?: AbortSignal): Promise<TResult> => {
    try {
      const result = await fn(options, signal);
      return result;
    } catch (err) {
      if (isCancel(err)) {
        throw createAbortError();
      }
      throw err;
    }
  };
  return wrappedFn;
};
