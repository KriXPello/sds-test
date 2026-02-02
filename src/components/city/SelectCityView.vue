<template>
  <div class="select-city-view">
    <div class="header select-city-view__header">
      <ElInput
        :model-value="query"
        class="header__input"
        placeholder="Введите название города"
        clearable
        @update:model-value="emit('update:query', $event)"
      >
        <template #prepend>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>

      <ElButton
        title="Определить местоположение"
        :icon="MapLocation"
        type="primary"
        :loading="locationLoading"
        :disabled="locationLoading"
        @click="handleFindLocation"
      />
    </div>

    <div class="select-city-view__content">
      <ElScrollbar>
        <!-- подсказки из поиска -->
        <div
          v-if="suggestions.length"
          v-loading="citiesLoading"
          class="city-list select-city-view__block"
        >
          <CityCard
            v-for="city in suggestions"
            :key="city.name + city.latitude + city.longitude"
            class="city-list__item"
            :data="city"
            @click="handleSelectCity(city)"
          />
        </div>
        <!-- индикатор загрузки пока нет подсказок -->
        <div
          v-else-if="citiesLoading"
          v-loading="citiesLoading"
          class="select-city-view__loading-placeholder select-city-view__block"
        />

        <!-- при ошибке поиска -->
        <ErrorWithRetry
          v-if="error"
          class="select-city-view__block"
          text="Не удалось получить список городов"
          @retry="handleRetrySearch"
        />

        <!-- список недавно выбранных городов -->
        <div v-if="recent.length" class="city-list select-city-view__block">
          <h4 class="city-list__title">
            Последние выбранные города
          </h4>
          <CityCard
            v-for="city in recent"
            :key="city.name + city.latitude + city.longitude"
            class="city-list__item"
            :data="city"
            @click="handleSelectCity(city)"
          />
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, MapLocation } from '@element-plus/icons-vue';
import { ElButton, ElIcon, ElInput, ElScrollbar, vLoading } from 'element-plus';
import { ErrorWithRetry } from '~/components/base';
import type { CityInfo } from '~/types/models';
import CityCard from './CityCard.vue';

defineProps<{
  suggestions: CityInfo[];
  recent: CityInfo[];
  query: string;
  error?: string | null;
  citiesLoading?: boolean;
  locationLoading?: boolean;
}>();

const emit = defineEmits<{
  'update:query': [value: string];
  select: [value: CityInfo];
  retry: [];
  'find-location': [];
}>();

const handleRetrySearch = () => {
  emit('retry');
};

const handleSelectCity = (city: CityInfo) => {
  emit('select', city);
};

const handleFindLocation = () => {
  emit('find-location');
};

</script>

<style scoped>
.select-city-view {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.select-city-view__header {
  width: 100%;
}
.select-city-view__content {
  overflow: hidden;
  flex: 1;
  min-height: 0;
}
.select-city-view__loading-placeholder {
  width: 100%;
  height: 50px;
}
.select-city-view__block {
  margin-bottom: 16px;
}

.header {
  display: flex;
  gap: 4px;
}
.header__navbar {
  width: 100%;
}
.header__input {
  width: 100%;
}
.header__title {
  font-size: 24px;
  font-weight: bold;
}

.city-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}
.city-list__title {
  margin-bottom: 8px;
}
.city-list__item {
  border: solid 1px lightgray;
  border-radius: 8px;
}
</style>
