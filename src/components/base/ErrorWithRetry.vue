<template>
  <ElAlert
    class="error-with-retry"
    type="error"
    show-icon
    :closable="false"
  >
    <ElText size="large" tag="p">
      {{ text }}
    </ElText>
    <ElButton type="primary" @click="emit('retry', $event)">
      Повторить
    </ElButton>
  </ElAlert>
</template>

<script setup lang="ts">
import { ElAlert, ElButton, ElText } from 'element-plus';

defineProps<{
  text: string;
}>();

const emit = defineEmits<{
  retry: [event: MouseEvent];
}>();

</script>

<style scoped>
.error-with-retry {
  text-align: center;
}
</style>
