<template>
  <ElDialog
    :model-value="true"
    title="Подтверждение"
    width="min(90%, 380px)"
    @close="handleCancel"
  >
    <ElText>Вы находитесь в этом городе?</ElText>
    <CityCard :data="city" />

    <template #footer>
      <div class="dialog-footer">
        <ElButton type="primary" @click="handleSubmit">
          Да
        </ElButton>
        <ElButton @click="handleCancel">
          Нет
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElButton, ElDialog, ElText } from 'element-plus';
import CityCard from './CityCard.vue';
import { CityInfo } from '~/types/models';

defineProps<{
  city: CityInfo;
}>();

const emit = defineEmits<{
  submit: [];
  cancel: [];
}>();

const handleSubmit = () => {
  emit('submit');
};

const handleCancel = () => {
  emit('cancel');
};

</script>
