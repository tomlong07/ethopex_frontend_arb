<script setup lang="ts">
import { TType } from '@/enum/naiveui'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  class: {
    type: String,
    default: 'w-28',
  },
})

const value = defineModel<string>('value')

const typeNow = (status?: string) => {
  return (helper.classRender(status) as TType) || undefined
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div :class="props.class" class="w-40">{{ props.name }}</div>
    <div
      v-if="props.name != 'Delivery Status Reasons'"
      class="flex-1 min-w-0 uppercase w-[calc(100%-10rem)]"
    >
      <n-tag :type="typeNow(value)" class="n-tag-exclude">
        {{ value || 'N/A' }}
      </n-tag>
    </div>
    <div v-else class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      {{ value || 'No reasons' }}
    </div>
  </div>
</template>
