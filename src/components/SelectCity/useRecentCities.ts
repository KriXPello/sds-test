import { onMounted, ref, watch } from 'vue';
import { CityInfo } from '~/types/models';

const RECENT_CITIES_KEY = 'recent_cities';
const MAX_RECENT = 5;

export const useRecentCities = () => {
  const recentCities = ref<CityInfo[]>([]);

  onMounted(() => {
    const stored = localStorage.getItem(RECENT_CITIES_KEY);
    if (stored) {
      try {
        recentCities.value = JSON.parse(stored);
      } catch {
        recentCities.value = [];
      }
    }
  });
  watch(recentCities, (list) => localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(list)));

  const addRecentCity = (city: CityInfo) => {
    const recentList = recentCities.value.slice();
    const existsIndex = recentList.findIndex(
      (x) => x.latitude === city.latitude && x.longitude === city.longitude,
    );
    if (existsIndex >= 0) {
      recentList.splice(existsIndex, 1);
    }
    recentList.unshift(city);
    const limitedList = recentList.slice(0, MAX_RECENT);
    recentCities.value = limitedList;
  };

  return {
    recentCities,
    addRecentCity,
  };
};
