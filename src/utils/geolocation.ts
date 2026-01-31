export enum GeolocationErrorKind {
  PermissionDenied = 1,
  Unexpected = 2,
  Timeout = 3,
  NotSupported = 100,
}

const errorsMap: Record<number, GeolocationErrorKind> = {
  [GeolocationPositionError.PERMISSION_DENIED]: GeolocationErrorKind.PermissionDenied,
  [GeolocationPositionError.POSITION_UNAVAILABLE]: GeolocationErrorKind.Unexpected,
  [GeolocationPositionError.TIMEOUT]: GeolocationErrorKind.Timeout,
};

export type GetGeolocationResult = {
  geolocation: GeolocationPosition;
  error?: never;
} | {
  geolocation?: never;
  error: GeolocationErrorKind;
};

export const getGeolocation = (): Promise<GetGeolocationResult> => {
  return new Promise<GetGeolocationResult>((resolve) => {
    if (!navigator.geolocation) {
      resolve({ error: GeolocationErrorKind.PermissionDenied });
    }

    navigator.geolocation.getCurrentPosition(
      (geolocation) => resolve({ geolocation }),
      (err) => {
        const kind = errorsMap[err.code] ?? GeolocationErrorKind.Unexpected;
        resolve({ error: kind });
      },
    );
  });
};
