<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { AdSetupOptions } from '@/options/campaign'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  class: {
    type: String,
    default: 'w-28',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  required: {
    type: Boolean,
    default: false,
  },
})

const value = defineModel<string>('value')
</script>

<template>
  <FloatingWrapper :name="props.name" required>
    <n-select
      :disabled="props.disabled"
      v-model:value="value"
      :placeholder="props.name"
      :options="AdSetupOptions"
      class="flex-1 min-w-0"
    />
  </FloatingWrapper>
</template>
