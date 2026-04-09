<script setup lang="ts">
import { computed } from 'vue'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    size?: ModalSize
    loading?: boolean
    showFooter?: boolean
  }>(),
  {
    modelValue: false,
    size: 'md',
    loading: false,
    showFooter: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit'): void
  (e: 'before-open'): void
  (e: 'before-close'): void
  (e: 'cancel'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const widthMap: Record<ModalSize, string> = {
  sm: '400px',
  md: '600px',
  lg: '800px',
  xl: '1000px',
  full: '90vw',
}

const modalWidth = computed(() => widthMap[props.size || 'md'])

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const handleSubmit = () => {
  emit('submit')
}

watch(
  () => visible.value,
  (v) => {
    if (v) {
      emit('before-open')
    } else {
      emit('before-close')
    }
  }
)
</script>

<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    :title="title"
    :style="{ width: modalWidth }"
    :mask-closable="false"
  >
    <template #header v-if="$slots.header">
      <slot name="header" />
    </template>

    <slot />

    <template #footer v-if="showFooter !== false">
      <slot name="footer">
        <div class="flex justify-end gap-2">
          <n-button @click="handleCancel"> Cancel </n-button>
          <n-button type="error" :loading="loading" @click="handleSubmit">
            Submit
          </n-button>
        </div>
      </slot>
    </template>
  </n-modal>
</template>
