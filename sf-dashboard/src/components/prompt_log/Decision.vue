<script setup lang="ts">
import { Size } from 'naive-ui/es/button/src/interface'

const props = defineProps({
  name: { type: String, required: true },
  className: { type: String },
  disabled: { type: Boolean, default: false },
  float: { type: Boolean, default: false },
  size: { type: String, default: 'small' },
})

const value = defineModel<string>('value')

const classNow = computed(() => {
  const classList = props.size === 'small' ? 'text-xs' : ''
  const classFloat = props.float
    ? 'text-xs text-gray-500 font-semibold'
    : 'font-bold'
  return [props.className || 'w-28', classList, classFloat].join(' ')
})

const isSuccess = computed(() => {
  return value.value === 'PASS'
})

const isError = computed(() => {
  return value.value === 'REJECT'
})
</script>

<template>
  <div class="flex gap-2" :class="props.float ? 'flex-col' : 'items-center'">
    <div :class="classNow">{{ props.name }}</div>

    <div class="flex gap-2">
      <n-button
        :disabled="props.disabled"
        :type="isSuccess ? 'success' : undefined"
        :size="props.size as Size"
        @click="value = 'PASS'"
      >
        PASS
      </n-button>
      <n-button
        :disabled="props.disabled"
        :type="isError ? 'error' : undefined"
        :size="props.size as Size"
        @click="value = 'REJECT'"
      >
        REJECT
      </n-button>
    </div>
  </div>
</template>
