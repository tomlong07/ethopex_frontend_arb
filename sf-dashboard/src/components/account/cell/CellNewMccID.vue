<script setup lang="ts">
import helper from '@/utils/helper'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const valueNow = computed(() => props.params.value)
const classType = computed(() => {
  switch (valueNow.value?.status.toLowerCase()) {
    case 'pending':
      return 'text-yellow-500'
    case 'bot_done':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
  }

  return 'default'
})

const isShow = computed(() => {
  return !!(
    valueNow.value?.time ||
    valueNow.value?.note ||
    valueNow.value?.status
  )
})
</script>
<template>
  <div>
    <n-popover trigger="hover" v-if="isShow">
      <template #trigger>
        <div class="flex flex-col items-start">
          <span :class="classType">
            {{ valueNow?.new_mcc_id }}
          </span>
        </div>
      </template>

      <div class="text-sm font-bold">
        Time:
        <span class="font-normal">
          {{ helper.formatFullDate(valueNow?.time) }}
        </span>
      </div>

      <div class="text-sm font-bold" v-if="valueNow?.status">
        Status:
        <span class="font-normal" :class="classType">
          {{ helper.capitalizeFirstLetter(valueNow?.status) }}
        </span>
      </div>

      <div class="text-sm font-bold" v-if="valueNow?.note">
        Note:
        <span class="font-normal">
          {{ valueNow?.note }}
        </span>
      </div>
    </n-popover>

    <div v-else class="flex flex-col items-start">
      <span :class="classType">
        {{ valueNow?.new_mcc_id }}
      </span>
    </div>
  </div>
</template>
