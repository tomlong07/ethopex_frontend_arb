<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format, subDays } from 'date-fns'

import { utcToZonedTime } from 'date-fns-tz'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
const yesterday = () => {
  // Lấy thời gian hiện tại
  const now = new Date()

  // Chuyển sang UTC
  const yesterdayUTC = utcToZonedTime(subDays(now, 1), 'UTC')

  // Format thời gian UTC
  return format(yesterdayUTC, "yyyy-MM-dd HH:mm:ss 'UTC'")
}

const setStartDate = (value: string) => {
  if (!value) {
    props.campaign.start_date = ''
    return
  }

  props.campaign.start_date = value.split('T')[0]
}

const setEndDate = (value: string) => {
  if (!value) {
    props.campaign.end_date = ''
    return
  }

  props.campaign.end_date = value.split('T')[0]
}

const isDisabledDate = computed<boolean>(() => {
  if (props.FreezeData.isEditPage()) {
    if (props.campaign.traffic_source_id) {
      return true
    } else {
      return false
    }
  }
  return false
})

onMounted(() => {
  if (!props.campaign.start_date) {
    props.campaign.start_date = ''
  }
  if (!props.campaign.end_date) {
    props.campaign.end_date = ''
  }
})

const name = 'Start date'
const name2 = 'End date'
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="text-xs font-bold">Date Range</div>
    <FloatingWrapper rounded>
      <div class="flex items-center datepicker-menu-custom">
        <VueDatePicker
          :model-value="props.campaign.start_date"
          format="yyyy/MM/dd 'UTC'"
          timezone="UTC"
          utc="preserve"
          clearable
          auto-apply
          text-input
          :placeholder="name"
          :min-date="yesterday()"
          :disabled="isDisabledDate"
          class="small-datepicker"
          @update:model-value="setStartDate"
        >
          <template #clear-icon="{ clear }"> &nbsp; </template>
        </VueDatePicker>
      </div>
    </FloatingWrapper>

    <FloatingWrapper rounded>
      <div class="flex items-center datepicker-menu-custom">
        <VueDatePicker
          :model-value="props.campaign.end_date"
          format="yyyy/MM/dd 'UTC'"
          timezone="UTC"
          utc="preserve"
          clearable
          auto-apply
          text-input
          :placeholder="name2"
          :min-date="yesterday()"
          :disabled="isDisabledDate"
          class="small-datepicker"
          @update:model-value="setEndDate"
        >
          <template #clear-icon="{ clear }"> &nbsp; </template>
        </VueDatePicker>
      </div>
    </FloatingWrapper>
  </div>
</template>

<style lang="scss">
@use '@/css/DateRangerV3.scss';
</style>
