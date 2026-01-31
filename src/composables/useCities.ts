import { ref } from 'vue';
import { fetchCitiesInfo } from '~/api/openweather';
import { isAbortError } from '~/api/errors';
import type { CityInfo } from '~/types/models';

export const useCities = () => {
  const cities = ref<CityInfo[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  let abortController: AbortController | null = null;

  /**
   * ! Прерывает предыдущий запрос при повторном вызове до завершения
   */
  const searchCities = async (query: string) => {
    abortController?.abort();

    if (!query.trim()) {
      cities.value = [];
      return;
    }

    abortController = new AbortController();
    isLoading.value = true;
    error.value = null;

    try {
      cities.value = await fetchCitiesInfo(
        {
          searchQuery: query,
        },
        abortController.signal,
      );
    } catch (e) {
      if (isAbortError(e)) return;
      error.value = 'Не удалось получить список городов';
      cities.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    cities,
    isLoading,
    error,
    searchCities,
  };
};
