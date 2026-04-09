<script setup lang="ts">
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'off', // mặc định ban đầu là off
  },
  loading: {
    type: Boolean,
    default: false,
  },
  checkedValue: {
    type: String,
    default: 'on',
  },
  uncheckedValue: {
    type: String,
    default: 'off',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: '',
  },
  checkColor: {
    type: String,
    default: '#121212', // mặc định màu đen đậm
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:value', value: string): void
}>()

// Proxy cho v-model (get/set)
const valueProxy = computed({
  get: () => props.modelValue,
  set: (val: string) => {
    emit('update:modelValue', val)
    emit('update:value', val)
  },
})
</script>

<template>
  <n-switch
    v-model:value="valueProxy"
    :loading="props.loading"
    :checked-value="props.checkedValue"
    :unchecked-value="props.uncheckedValue"
    :disabled="props.disabled"
    :class="props.class"
  >
    <template #checked-icon>
      <n-icon :component="Checkmark" :color="props.checkColor" />
    </template>
    <template #unchecked-icon>
      <n-icon :component="Close" />
    </template>
  </n-switch>
</template>
