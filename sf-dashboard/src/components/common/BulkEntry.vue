<script setup lang="ts">
import { Size } from 'naive-ui/es/button/src/interface'

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: 'campaign',
  },

  type: {
    type: String,
    required: false,
    default: 'campaign',
  },

  textButton: {
    type: String,
    required: false,
    default: 'Bulk Entry',
  },

  round: {
    type: Boolean,
    default: false,
  },

  size: {
    type: String,
    default: 'medium',
  },
})

const emit = defineEmits<{
  (e: 'clickAction', type: string): void
}>()

const clickAction = (type: string) => {
  emit('clickAction', type)
}
</script>
<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button
        class="w-24"
        color="#f43f5e"
        @click="clickAction(props.type)"
        :round="props.round"
        :size="(props.size as Size)"
      >
        {{ textButton }}
      </n-button>
    </template>
    <span
      >Enter multiple {{ props.text }} ids separated by commas or lines.</span
    >
  </n-tooltip>
</template>
