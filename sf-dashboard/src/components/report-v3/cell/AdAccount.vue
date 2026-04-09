<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'
import { CellComponent } from 'tabulator-tables'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})
const reportStoreV2 = useReportV2(helper.truePath())()

const name = props.cell?.getValue() || '-'

const href = computed(() => {
  return `/?ad_account=${name}&group=campaign&start_date=${reportStoreV2.filter.start_date}&end_date=${reportStoreV2.filter.end_date}`
})
</script>
<template>
  <a :href="href" target="_blank" class="text-blue-500" v-if="name != '-'">{{
    name
  }}</a
  >{{ name == '-' ? '-' : '' }}
</template>
