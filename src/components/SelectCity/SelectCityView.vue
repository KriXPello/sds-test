<template>
  <ElContainer class="select-city-view">
    <ElHeader class="select-city-view__header">
      <ElPageHeader
        class="header-navbar"
        title="Назад"
        @back="emit('back')"
      >
        <template #content>
          <span class="header-navbar__title">Выбор города</span>
        </template>
      </ElPageHeader>

      <ElInput
        v-model="query"
        class="select-city-view__header-input"
        placeholder="Введите название города"
        clearable
        @input="searchCitiesDebounced"
      >
        <template #prepend>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>
    </ElHeader>

    <ElMain>
      <ElScrollbar>
        <!-- подсказки из поиска -->
        <div v-if="suggestions.length" v-loading="isLoading" class="suggestions">
          <SelectCityItem
            v-for="city in suggestions"
            :key="city.name + city.latitude + city.longitude"
            class="list-item"
            :data="city"
            @click="selectCity(city)"
          />
        </div>

        <!-- при ошибке поиска -->
        <ElAlert
          v-if="error"
          type="error"
          :closable="false"
          class="error-alert"
        >
          <ElText>Не удалось получить список городов</ElText>
          <ElButton type="primary" @click="retrySearch">
            Повторить
          </ElButton>
        </ElAlert>

        <!-- список недавно выбранных городов -->
        <div v-if="recentCities.length" class="recent-cities">
          <h4 class="recent-cities__title">
            Последние выбранные города
          </h4>
          <SelectCityItem
            v-for="city in recentCities"
            :key="city.name + city.latitude + city.longitude"
            class="list-item"
            :data="city"
            @click="selectCity(city)"
          />
        </div>
      </ElScrollbar>
    </ElMain>
  </ElContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCities } from '~/composables/useCities';
import type { CityInfo } from '~/types/models';
import { ElInput, ElAlert, vLoading, ElIcon, ElScrollbar, ElText, ElButton, ElContainer, ElHeader, ElMain, ElPageHeader } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useRecentCities } from './useRecentCities';
import { debounceFn } from '~/utils/debounce';
import SelectCityItem from '~/components/SelectCity/SelectCityItem.vue';

const emit = defineEmits<{
  select: [value: CityInfo];
  back: [];
}>();

const query = ref('');
const { cities: suggestions, searchCities, isLoading, error } = useCities();

const searchCitiesDebounced = debounceFn(searchCities, 600);
const retrySearch = () => {
  searchCities(query.value);
};

const { recentCities, addRecentCity } = useRecentCities();

const selectCity = (city: CityInfo) => {
  emit('select', city);

  query.value = '';
  addRecentCity(city);
};

</script>

<style scoped>
.select-city-view__header {
  display: flex;
  flex-direction: column;
  height: min-content;
  gap: 8px;
  padding-top: 24px;
  padding-bottom: 0px;
}

.header-navbar {
  width: 100%;
}

.header-navbar__title {
  font-weight: bold;
}

.select-city-view__header-input {
  width: 100%;
}

.suggestions {
  margin-bottom: 12px;
}

.recent-cities__title {
  margin-bottom: 12px;
}

.list-item:not(:first-child) {
  margin-top: 4px;
}

.error-alert {
  margin-top: 8px;
}

.loading-spinner {
  display: block;
  margin: 8px auto;
}
</style>
