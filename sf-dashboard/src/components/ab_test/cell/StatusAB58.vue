<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { NPopover, NTag } from 'naive-ui'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams & { classPlus?: string },
    default: () => {},
    required: false,
  },
})

const classPlus = props.params?.classPlus

const classNow = computed<any>(() => {
  return helper.classRender(props.params?.value || '')
})

const popoverDesc: Record<string, string> = {
  waiting: 'Domains waiting to be tested',
  ready: 'Eligible and ready for testing',
  ab_testing: 'Currently under A/B testing',
  winner: 'Test completed, selected as winner',
  loser: 'Test completed, did not meet requirements',
}
</script>
<template>
  <div
    class="flex h-full items-center"
    v-if="props.params?.value && props.params?.value != ''"
  >
    <n-popover trigger="hover" placement="top" :class="classPlus">
      <template #trigger>
        <n-tag size="small" class="capitalize" round :type="classNow">
          {{ props.params?.value }}
        </n-tag>
      </template>
      <span>{{ popoverDesc[props.params?.value] }}</span>
    </n-popover>
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
