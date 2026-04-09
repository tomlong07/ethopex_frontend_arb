<script setup lang="ts">
import RedDot from '@/components/common/RedDot.vue'
import { ctr_time_zone } from '@/services/ctr_time_zone'
import { adGroups, FreezeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
const optionTimzone = ref<SelectOption[]>([])
const originalData = ref<any[]>([])

onMounted(async () => {
  const rs = await ctr_time_zone.GetTimezoneByTrafficSource('tiktok')

  originalData.value = rs.data

  optionTimzone.value = rs.data.map((item: any, index: number) => ({
    label: item.name,
    value: index.toString(), // Use index as unique value
  }))
})

const timeZoneType = computed({
  get: () => {
    const originalOffset = props.adgroup.schedule?.time_zone_type
    if (!originalOffset) return undefined

    const index = originalData.value.findIndex(
      (item) => item.offset === originalOffset
    )
    return index >= 0 ? index.toString() : undefined
  },
  set: (indexStr) => {
    if (!indexStr) return

    const index = parseInt(indexStr)
    const originalOffset = originalData.value[index]?.offset

    if (!props.adgroup.schedule) {
      props.adgroup.schedule = { time_zone_type: originalOffset } as any
    } else {
      props.adgroup.schedule.time_zone_type = originalOffset
    }
  },
})
const name = 'Time zone'
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-40 font-bold">{{ name }} <RedDot /></div>
    <div class="flex-1 min-w-0">
      <n-select
        v-model:value="timeZoneType"
        :placeholder="name"
        :options="optionTimzone"
      />
    </div>
  </div>
</template>
