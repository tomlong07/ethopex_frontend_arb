<script setup lang="ts">
import ArrowDown from '@/assets/icons/ArrowDown.vue'
import ArrowUp from '@/assets/icons/ArrowUp.vue'
import { useReportV2 } from '@/store/report/report-v2'
import { NIcon, SelectOption } from 'naive-ui'
import { VNodeChild } from 'vue'

const reportStoreV2 = useReportV2(helper.truePath())()

const orderByOptions = computed(() => {
  return reportStoreV2.reportOptions.orderBy?.flatMap((item) => [
    {
      value: `${item.value}_desc`,
      label: item.label,
      type: 'desc',
    },
    {
      value: `${item.value}_asc`,
      label: item.label,
      type: `asc`,
    },
  ])
})

const renderLabel = (option: SelectOption): VNodeChild => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      },
    },
    [
      h('span', option.label as string),
      h(
        NIcon,
        {},
        {
          default: () => h(option.type === 'desc' ? ArrowDown : ArrowUp),
        }
      ),
    ]
  )
}
</script>
<template>
  <div class="flex flex-col ml-auto w-32">
    <div class="font-bold text-xs text-gray-500 pb-1">Order By</div>
    <div class="flex">
      <n-select
        size="small"
        :options="orderByOptions"
        v-model:value="reportStoreV2.orderBy"
        :render-label="renderLabel"
      ></n-select>
    </div>
  </div>
</template>
