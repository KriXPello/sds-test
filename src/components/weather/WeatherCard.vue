<template>
  <ElCard class="weather-card" shadow="never">
    <ElSkeleton v-if="loading" loading>
      <template #template>
        <ElSkeletonItem variant="p" class="weather-card__temparature" />
        <ElSkeletonItem variant="p" class="weather-card__description" />
        <ElSkeletonItem variant="p" class="weather-card__wet" />
        <ElSkeletonItem variant="p" class="weather-card__wind" />
      </template>
    </ElSkeleton>

    <div v-else class="weather-card__content">
      <div class="weather-card__info">
        <p class="weather-card__temparature">
          {{ Math.round(weather.temperature) }}°C
        </p>
        <p class="weather-card__description">
          {{ weather.description }}
        </p>
        <p class="weather-card__wet">
          <span>Влажность: </span>
          <span>{{ weather.wet }}%</span>
        </p>
        <p class="weather-card__wind">
          <span>Ветер: </span>
          <span>{{ weather.windSpeed }}&nbsp;м/с</span>
        </p>
      </div>

      <img
        v-if="iconUrl"
        class="weather-card__icon"
        width="60"
        height="60"
        :src="iconUrl"
        alt="иконка погоды"
      >
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { ElCard, ElSkeleton, ElSkeletonItem } from 'element-plus';
import { WeatherInfo } from '~/types/models';

/**
 * При loading true компонент является скелетоном карточки погоды.
 *
 * Это нужно чтобы снизить вероятность расхождения стилей карточки и скелетона
 */
type Props = {
  loading: true;
  weather?: never;
  iconUrl?: never;
} | {
  loading?: false;
  weather: WeatherInfo;
  iconUrl: string | null;
};

defineProps<Props>();

</script>

<style scoped>
.weather-card {

}

.weather-card__content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.weather-card__temparature {
  font-size: 32px;
  font-weight: bold;
}

.weather-card__description {
  margin-bottom: 8px;
  text-transform: capitalize;
}
</style>
