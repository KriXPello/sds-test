<template>
  <ElCard
    class="select-city-item"
    :class="{ 'select-city-item_interactive': onClick }"
    :shadow="onClick ? 'hover' : 'never'"
    @click="onClick"
  >
    <ElText class="select-city-item__name" size="large" tag="p">
      {{ data.name }}
    </ElText>
    <ElText v-if="data.state" class="select-city-item__state" tag="p">
      {{ data.state }}
    </ElText>
  </ElCard>
</template>

<script setup lang="ts">
import { CityInfo } from '~/types/models';
import { ElCard, ElText } from 'element-plus';

defineProps<{
  data: CityInfo;
  onClick?: (event: MouseEvent) => void;
}>();

</script>

<style scoped>
.select-city-item {
  display: flex;
  flex-direction: column;
  --el-card-padding: 14px;
}

.select-city-item_interactive {
  cursor: pointer;
}

.select-city-item__name {
  font-weight: 700;
}
</style>
