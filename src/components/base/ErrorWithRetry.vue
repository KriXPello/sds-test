<template>
  <ElAlert
    class="error-with-retry"
    type="error"
    show-icon
    :closable="false"
  >
    <div class="error-with-retry__content">
      <ElText class="error-with-retry__text" size="large" tag="p">
        {{ text }}
      </ElText>
      <ElButton
        class="error-with-retry__action"
        type="primary"
        title="Повторить"
        :icon="RefreshLeft"
        @click="emit('retry', $event)"
      />
    </div>
  </ElAlert>
</template>

<script setup lang="ts">
import { ElAlert, ElButton, ElText } from 'element-plus';
import { RefreshLeft } from '@element-plus/icons-vue';

defineProps<{
  text: string;
}>();

const emit = defineEmits<{
  retry: [event: MouseEvent];
}>();

</script>

<style scoped>
.error-with-retry {

}

.error-with-retry__content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-with-retry__text {
  flex: 1;
}
</style>
