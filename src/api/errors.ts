interface AbortError {
  name: 'AbortError';
}

export const createAbortError = (): Error => {
  const err = new Error('Aborted');
  err.name = 'AbortError';
  return err;
};

export const isAbortError = (err: unknown): err is AbortError => {
  if (typeof err == 'object' && err !== null) {
    return 'name' in err && err.name == 'AbortError';
  }
  return false;
};
