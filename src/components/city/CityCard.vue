<template>
  <div
    class="city-card"
    :class="{ 'city-card_clickable': onClick }"
    @click="onClick"
  >
    <div class="city-card__info">
      <ElText class="city-card__name" size="large" tag="p">
        {{ data.name }}
      </ElText>
      <ElText v-if="data.state" class="city-card__state" tag="p">
        {{ data.state }}
      </ElText>
    </div>

    <slot name="extra" />
  </div>
</template>

<script setup lang="ts">
import { CityInfo } from '~/types/models';
import { ElText } from 'element-plus';

defineProps<{
  data: CityInfo;
  onClick?: (event: MouseEvent) => void;
}>();

</script>

<style scoped>
.city-card {
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
  transition: background-color 0.2s ease;
  background-color: var(--bg-color);
}
.city-card_clickable {
  cursor: pointer;
}
.city-card_clickable:hover {
  background-color: #f6f6f6;
}

.city-card__info {
  flex: 1;
  margin-right: 8px;
}

.city-card__name {
  font-size: 18px;
  font-weight: 700;
}

</style>
