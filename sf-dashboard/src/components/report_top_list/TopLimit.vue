<script lang="ts" setup>
import useReportTopList from '@/store/useReportTopList'

const reportTopListStore = useReportTopList()

const options = [
  {
    value: 20,
    label: 'Top 20',
  },
  {
    value: 50,
    label: 'Top 50',
  },
  {
    value: 100,
    label: 'Top 100',
  },
]
const handleChangeSize = () => {
  reportTopListStore.buildQuery()
}
</script>
<template>
  <div class="flex gap-3 items-center">
    <span class="font-bold text-xs text-gray-500">Top:</span>
    <n-radio-group
      @update:value="handleChangeSize"
      v-model:value="reportTopListStore.reportConditions.size"
      name="radiogroup"
    >
      <n-space>
        <n-radio
          v-for="size in options"
          :key="size.value"
          :value="size.value"
          :label="size.label"
        />
      </n-space>
    </n-radio-group>
  </div>
</template>
