<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
// import useAccountAd from '@/store/useAccountAd'

// const accountAdStore = useAccountAd()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const parts = computed(() => props.params.value?.split('/') ?? [])

const total = computed(() => parts.value[0] || '0')
const enabled = computed(() => parts.value[1] || '0')
const suspended = computed(() => parts.value[2] || '0')
</script>
<template>
  <n-tooltip v-if="props.params.value">
    <template #trigger>
      <div class="truncate text-sm max-w-[160px] text-gray-800" title="">
        <span class="text-gray-600">{{ total }}</span>
        <span class="mx-1">/</span>
        <span class="text-green-600">{{ enabled }}</span>
        <span class="mx-1">/</span>
        <span class="text-red-500">{{ suspended }}</span>
      </div>
    </template>
    <span>
      Total: {{ total }}, Enabled: {{ enabled }}, Suspended: {{ suspended }}
    </span>
  </n-tooltip>
</template>
