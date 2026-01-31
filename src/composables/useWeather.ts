import { computed, ref } from 'vue';
import { fetchCurrentWeather } from '~/api/openweather';
import { isAbortError } from '~/api/errors';
import type { WeatherInfo } from '~/types/models';

export const useWeather = (initialData?: WeatherInfo) => {
  const weather = ref<WeatherInfo | null>(initialData ?? null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const iconUrl = computed(() => {
    const iconName = weather.value?.iconName;
    if (!iconName) return null;
    const url = new URL(`${iconName}.png`, import.meta.env.OPENWEATHERMAP_ICON_BASE_URL);
    return url.href;
  });

  let abortController: AbortController | null = null;

  /**
   * ! Прерывает предыдущий запрос при повторном вызове до завершения
   */
  const loadWeather = async (options: {
    latitude: number;
    longitude: number;
  }) => {
    abortController?.abort();
    abortController = new AbortController();

    isLoading.value = true;
    error.value = null;

    try {
      weather.value = await fetchCurrentWeather(
        {
          latitude: options.latitude,
          longitude: options.longitude,
        },
        abortController.signal,
      );
    } catch (e) {
      if (isAbortError(e)) return;
      error.value = 'Не удалось загрузить информацию о погоде';
      weather.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    weather,
    isLoading,
    error,
    iconUrl,
    loadWeather,
  };
};
