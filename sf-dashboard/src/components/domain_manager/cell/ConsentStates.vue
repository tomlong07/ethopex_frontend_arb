<script lang="ts" setup>
import Close from '@/assets/icons/Close.vue'
import Error from '@/assets/icons/Error.vue'
import Success from '@/assets/icons/Success.vue'
import Tick from '@/assets/icons/Tick.vue'

const props = defineProps({
  data: {
    type: Object,
  },
})

const legendItems = readonly([
  { key: 'gdpr', field: 'gdpr', label: 'GDPR', color: 'bg-cyan-500' },
  { key: 'ccpa', field: 'ccpa', label: 'CCPA', color: 'bg-pink-500' },
  {
    key: 'adblock',
    field: 'ad_blocking',
    label: 'Ad Block',
    color: 'bg-lime-500',
  },
])

const failedItems = computed(() => {
  return legendItems.filter((item) => props.data?.[item.field] !== 'on')
})

const legendStates = computed(() => {
  return legendItems.map((item) => ({
    ...item,
    passed: props.data?.[item.field] === 'on',
  }))
})
const isPassed = computed(() => failedItems.value.length === 0)
</script>
<template>
  <n-popover trigger="hover" :show-arrow="false">
    <template #trigger>
      <n-icon
        :component="isPassed ? Success : Error"
        :size="isPassed ? 16 : 14"
      />
    </template>

    <ul class="text-sm space-y-1 w-fit list-disc pl-4">
      <li
        v-for="state in legendStates"
        :key="state.key + (state.passed ? '-on' : '-off')"
      >
        <div class="flex gap-1 items-center">
          <span class="text-sm">{{ state.label }}</span>
          <span :class="state.passed ? 'text-green-400' : 'text-red-300'">
            <n-icon :component="state.passed ? Tick : Close" size="13" />
          </span>
        </div>
      </li>
    </ul>
  </n-popover>
</template>
