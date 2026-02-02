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
            :auto-insert-space="false"
            @click="openSelectCity"
          />
          <ElButton
            class="selected-city__refresh"
            title="Обновить"
            :icon="Refresh"
            :loading="weatherLoading"
            type="warning"
            :auto-insert-space="false"
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
        @retry="retryLoadWeather(selectedCity)"
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
        :loading="citiesLoading"
        :suggestions="cities"
        :recent="recentCities"
        @select="handleCitySelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Refresh } from '@element-plus/icons-vue';
import { ElButton, ElPageHeader } from 'element-plus';
import { ref, watch } from 'vue';
import { SelectCityView, CityCard } from '~/components/city';
import { WeatherView } from '~/components/weather';
import { useCities } from '~/composables/useCities';
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

const { recentCities, addRecentCity } = useRecentCities();

const selectedCity = ref<CityInfo | null>(null);
const handleCitySelect = (cityInfo: CityInfo) => {
  query.value = '';
  selectedCity.value = cityInfo;
  closeSelectCity();
  addRecentCity(cityInfo);
  loadWeather({
    latitude: cityInfo.latitude,
    longitude: cityInfo.longitude,
  });
};

const retryLoadWeather = (city: CityInfo) => {
  loadWeather({
    latitude: city.latitude,
    longitude: city.longitude,
  });
};

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
