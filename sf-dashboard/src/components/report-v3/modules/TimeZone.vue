<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import SkeletonSelect from '@/components/common/SkeletonSelect.vue'

import { ctr_report } from '@/services/ctr_report'
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()

const timeZoneOptions = ref<SelectOption[]>([])
const isLoadingTimeZone = ref<boolean>(true)

const loadTimeZone = async () => {
  isLoadingTimeZone.value = true

  const result = await ctr_report.TimeZone()

  if (result?.status) {
    let found = false
    timeZoneOptions.value =
      result?.data.map((item: any) => {
        if (item.name === reportStoreV2.timezone) {
          found = true
        }
        return {
          label: `(UTC${item.offset}) ${item.name}`,
          value: item.name,
        }
      }) ?? []

    if (!found) {
      window.message.info(
        'Your current time zone is unavailable and will be reset to default.'
      )
      reportStoreV2.timezone = 'UTC'
    }
  }

  isLoadingTimeZone.value = false
}

watch(
  () => reportStoreV2.isReady,
  (newValue) => {
    if (newValue) {
      loadTimeZone()
    }
  }
)
</script>

<template>
  <SkeletonSelect
    v-if="isLoadingTimeZone || !reportStoreV2.isReady"
    class="w-52"
    size="small"
  />

  <div class="flex flex-col gap-1 w-52" v-else>
    <div class="text-xs font-bold h-6 text-gray-500">Timezone</div>
    <n-select
      class="small-select-dropdown"
      :menu-props="{ class: 'small-select-dropdown' }"
      v-model:value="reportStoreV2.timezone"
      filterable
      :options="timeZoneOptions"
      :consistent-menu-width="false"
      size="small"
      max-tag-count="responsive"
    />
  </div>
</template>
