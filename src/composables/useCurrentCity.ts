import { ref } from 'vue';
import { fetchCitiesByCoords } from '~/api/openweather';
import { CityInfo } from '~/types/models';
import { GeolocationErrorKind, getGeolocation } from '~/utils/geolocation';

const getGeoErrorDescription = (errorKind: GeolocationErrorKind): string => {
  if (errorKind == GeolocationErrorKind.NotSupported) return 'Геолокация не поддерживается вашим браузером';
  if (errorKind == GeolocationErrorKind.PermissionDenied) return 'Нет доступа к данным геолокации';
  return 'Не удалось определить ваше местоположение';
};

export const useCurrentCity = () => {
  const currentCity = ref<CityInfo | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  let abortController: AbortController | null = null;

  const loadCurrentCity = async () => {
    currentCity.value = null;
    isLoading.value = true;
    error.value = null;
    try {
      const result = await getGeolocation();
      if (result.error) {
        error.value = getGeoErrorDescription(result.error);
        return;
      }
      const { geolocation } = result;

      abortController?.abort();
      abortController = new AbortController();

      try {
        const cities = await fetchCitiesByCoords(
          {
            latitude: geolocation.coords.latitude,
            longitude: geolocation.coords.longitude,
          },
          abortController.signal,
        );
        if (cities.length == 0) {
          throw new Error('CityNotFound');
        }
        currentCity.value = cities[0];
      } catch {
        error.value = 'Не удалось определить ваш город';
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    currentCity,
    isLoading,
    error,
    loadCurrentCity,
  };
};
