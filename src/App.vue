<template>
  <div class="main">
    <div
      v-if="selectedCity"
      class="main__primary"
      :class="{ 'main__primary_select-open': isOpenSelectCity }"
    >
      <!-- Информация о выбранном городе -->
      <CityCard class="selected-city" :data="selectedCity">
        <template #extra>
          <ElButton
            class="selected-city__edit _mobile-only"
            title="Изменить"
            :icon="Edit"
            type="primary"
            @click="openSelectCity"
          />
          <ElButton
            class="selected-city__refresh"
            title="Обновить"
            :icon="Refresh"
            :loading="weatherLoading"
            type="warning"
            @click="handleRefresh(selectedCity)"
          />
        </template>
      </CityCard>

      <WeatherView
        class="main__weather-view"
        :error="weatherError"
        :loading="weatherLoading"
        :weather="weather"
        :icon-url="iconUrl"
        @retry="handleRetryLoadWeather(selectedCity)"
      />
    </div>

    <div
      class="main__secondary"
      :class="{ 'main__secondary_open': isOpenSelectCity || selectedCity == null }"
    >
      <ElPageHeader
        v-if="selectedCity"
        class="main__secondary-navbar _mobile-only"
        title="Назад"
        @back="closeSelectCity"
      >
        <template #content>
          <span>Выбор города</span>
        </template>
      </ElPageHeader>

      <SelectCityView
        v-model:query="query"
        class="main__secondary-city"
        :error="citiesError"
        :cities-loading="citiesLoading"
        :location-loading="currentCityLoading"
        :suggestions="cities"
        :recent="recentCities"
        @select="handleCitySelect"
        @retry="handleRetryCitySearch"
        @find-location="handleFindLocation"
      />
    </div>

    <CitySuggestDialog
      v-if="currentCity"
      :city="currentCity"
      @submit="handleSubmitCurrentCity(currentCity)"
      @cancel="handleCancelCurrentCity"
    />
  </div>
</template>

<script setup lang="ts">
import { Edit, Refresh } from '@element-plus/icons-vue';
import { ElButton, ElMessage, ElPageHeader } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { CityCard, CitySuggestDialog, SelectCityView } from '~/components/city';
import { WeatherView } from '~/components/weather';
import { useCities } from '~/composables/useCities';
import { useCurrentCity } from '~/composables/useCurrentCity';
import { useRecentCities } from '~/composables/useRecentCities';
import { useWeather } from '~/composables/useWeather';
import type { CityInfo } from '~/types/models';
import { debounceFn } from '~/utils/debounce';

const {
  weather,
  iconUrl,
  isLoading: weatherLoading,
  error: weatherError,
  loadWeather,
} = useWeather();

const handleRefresh = (city: CityInfo) => {
  loadWeather({
    latitude: city.latitude,
    longitude: city.longitude,
  });
};

const isOpenSelectCity = ref(false);
const openSelectCity = () => {
  isOpenSelectCity.value = true;
};
const closeSelectCity = () => {
  isOpenSelectCity.value = false;
};

const {
  cities,
  isLoading: citiesLoading,
  error: citiesError,
  searchCities,
  cancelSearchCities,
} = useCities();
const searchCitiesDebounced = debounceFn(searchCities, 600);

const query = ref('');
watch(query, (newQuery) => {
  cancelSearchCities();
  searchCitiesDebounced.cancel();
  if (!newQuery.trim()) {
    return;
  }
  searchCitiesDebounced(newQuery);
});

const handleRetryCitySearch = () => {
  searchCities(query.value);
};

const { recentCities, addRecentCity } = useRecentCities();

const selectedCity = ref<CityInfo | null>(null);
watch(selectedCity, (city) => {
  if (city == null) return;
  loadWeather({
    latitude: city.latitude,
    longitude: city.longitude,
  });
});

const handleCitySelect = (cityInfo: CityInfo) => {
  query.value = '';
  selectedCity.value = cityInfo;
  closeSelectCity();
  addRecentCity(cityInfo);
};

const handleRetryLoadWeather = (city: CityInfo) => {
  loadWeather({
    latitude: city.latitude,
    longitude: city.longitude,
  });
};

const {
  currentCity,
  error: currentCityError,
  isLoading: currentCityLoading,
  loadCurrentCity,
} = useCurrentCity();

watch(currentCityError, (error) => {
  if (!error) return;
  ElMessage({
    message: error,
    type: 'warning',
    placement: 'bottom',
  });
});

const handleCancelCurrentCity = () => {
  currentCity.value = null;
};

const handleSubmitCurrentCity = (city: CityInfo) => {
  selectedCity.value = city;
  currentCity.value = null;
  closeSelectCity();
  addRecentCity(city);
};

const handleFindLocation = () => {
  loadCurrentCity();
};

onMounted(() => {
  const [lastRecentCity] = recentCities.value;
  if (lastRecentCity) {
    selectedCity.value = lastRecentCity;
  } else {
    ElMessage.info({
      message: 'Получение данных геолокации...',
      duration: 2000,
    });
    loadCurrentCity();
  }
});

</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 16px;
  padding-top: 32px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.main__primary {
  --primary-content-max-width: 460px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.main__primary_select-open {
  display: none;
}
.main__primary > * {
  width: 100%;
  max-width: var(--primary-content-max-width);
}

.selected-city {
  padding: 0;
}

.main__secondary {
  --secondary-content-max-width: 400px;
  display: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}
.main__secondary_open {
  display: flex;
}
.main__secondary > * {
  width: 100%;
  max-width: var(--secondary-content-max-width);
}

.main__secondary-navbar {
  margin-bottom: 12px;
}
.main__secondary-city {
  flex: 1;
  min-height: 0;
}

.no-city-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.no-city-selected__text {
  font-size: 24px;
  font-weight: bold;
}
.no-city-selected__button {
  margin-top: 12px;
}

@media screen and (min-width: 960px) {
  ._mobile-only {
    display: none;
  }

  .main {
    padding-top: 15vh;
    padding-top: 15dvh;
  }

  .main__primary {
    display: flex;
    max-width: var(--primary-content-max-width);
  }

  .main__secondary {
    display: flex;
    max-width: var(--secondary-content-max-width);
  }
}

</style>
