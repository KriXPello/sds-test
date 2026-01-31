<template>
  <SelectCityView
    v-show="isOpenSelectCity"
    class="select-view"
    @select="handleCitySelect"
    @back="closeSelectCity"
  />
  <div v-show="!isOpenSelectCity" class="main-wrapper">
    <ElContainer class="main">
      <ElHeader v-if="selectedCity" class="main__header">
        <div class="selected-city">
          <ElText class="selected-city__name" size="large" type="primary" tag="p">
            {{ selectedCity.name }}
          </ElText>
          <ElText v-if="selectedCity.state" class="selected-city__region" tag="p">
            {{ selectedCity.state }}
          </ElText>
        </div>

        <ElButton title="Изменить" :icon="Edit" @click="openSelectCity" />
      </ElHeader>

      <ElMain v-if="selectedCity" class="main__content">
        <!-- состояние ошибки при загрузке погоды -->
        <ElAlert
          v-if="weatherError"
          type="error"
          :closable="false"
          show-icon
        >
          {{ weatherError }}
        </ElAlert>

        <!-- состояние загрузки погоды -->
        <ElSkeleton
          v-else-if="weatherLoading"
          animated
        >
          <template #template>
            <ElCard>
              <ElSkeletonItem variant="h1" />
              <ElSkeletonItem variant="text" />
              <ElSkeletonItem variant="text" />
            </ElCard>
          </template>
        </ElSkeleton>

        <!-- отображение погоды -->
        <ElCard v-else-if="weather" class="weather-card" shadow="never">
          <div class="weather-card__content">
            <div class="weather-card__info">
              <div class="temperature">
                {{ Math.round(weather.temperature) }}°C
              </div>
              <div class="description">
                {{ weather.description }}
              </div>
              <div class="meta">
                Влажность: {{ weather.wet }}% <br>
                Ветер: {{ weather.windSpeed }} м/с
              </div>
            </div>

            <img
              v-if="iconUrl"
              :src="iconUrl"
              alt="иконка погоды"
            >
          </div>
        </ElCard>
      </ElMain>

      <!-- при отсутствии выбранного города -->
      <ElMain v-else class="no-city-selected">
        <ElText class="no-city-selected__text" size="large">
          Город не выбран
        </ElText>
        <ElButton class="no-city-selected__button" type="primary" @click="openSelectCity">
          Выбрать
        </ElButton>
      </ElMain>
    </ElContainer>
  </div>
</template>

<script setup lang="ts">
import { ElAlert, ElButton, ElCard, ElContainer, ElHeader, ElMain, ElSkeleton, ElSkeletonItem, ElText } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
import { ref } from 'vue';
import SelectCityView from '~/components/SelectCity/SelectCityView.vue';
import { useWeather } from '~/composables/useWeather';
import type { CityInfo } from '~/types/models';

const {
  weather,
  iconUrl,
  isLoading: weatherLoading,
  error: weatherError,
  loadWeather,
} = useWeather();

const isOpenSelectCity = ref(false);
const openSelectCity = () => {
  isOpenSelectCity.value = true;
};
const closeSelectCity = () => {
  isOpenSelectCity.value = false;
};

const selectedCity = ref<CityInfo | null>(null);
const handleCitySelect = (cityInfo: CityInfo) => {
  selectedCity.value = cityInfo;
  closeSelectCity();
  loadWeather({
    latitude: cityInfo.latitude,
    longitude: cityInfo.longitude,
  });
};

</script>

<style scoped>
.select-view {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.main-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 15vh;
}

.main {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
}

.main__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  height: min-content;
}

.main__content {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.selected-city__name {
  font-size: 28px;
}

.selected-city__region {
  font-size: 18px;
}

.weather-card {
  max-width: 400px;
  width: 100%;
  height: min-content;
}

.weather-card__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.temperature {
  font-size: 32px;
  font-weight: bold;
}

.description {
  text-transform: capitalize;
  margin-bottom: 8px;
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

</style>
