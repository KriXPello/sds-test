<template>
  <div class="weather-view">
    <!-- состояние ошибки -->
    <ErrorWithRetry
      v-if="error"
      class="weather-view__error"
      :text="error"
      @retry="handleRetryLoad"
    />

    <!-- состояние загрузки -->
    <WeatherCard v-else-if="loading" loading />

    <!-- информация о погоде -->
    <WeatherCard
      v-else-if="weather"
      :weather="weather"
      :icon-url="iconUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ErrorWithRetry } from '~/components/base';
import { WeatherInfo } from '~/types/models';
import WeatherCard from './WeatherCard.vue';

defineProps<{
  error?: string | null;
  loading?: boolean;
  weather: WeatherInfo | null;
  iconUrl: string | null;
}>();

const emit = defineEmits<{
  retry: [];
}>();

const handleRetryLoad = () => {
  emit('retry');
};

</script>

<style scoped>
.weather-view {

}

.weather-view__error {

}
</style>
