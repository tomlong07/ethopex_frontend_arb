<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import {
  FreezeClass,
  adGroups,
  campaignTypeClass,
} from '@/types/components/campaign-v2'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format, subDays } from 'date-fns'

import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz'

const yesterday = () => {
  // Lấy thời gian hiện tại
  const now = new Date()

  // Chuyển sang UTC
  const yesterdayUTC = utcToZonedTime(subDays(now, 1), 'UTC')

  // Format thời gian UTC
  return format(yesterdayUTC, "yyyy-MM-dd HH:mm:ss 'UTC'")
}

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const setStartDate = (value: string) => {
  if (!value) {
    props.adgroup.start_date = ''
    return
  }

  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', value)
      return
    }

    // Format theo yêu cầu API: YYYY-MM-DD HH:MM:SS
    props.adgroup.start_date = formatInTimeZone(
      date,
      'UTC',
      'yyyy-MM-dd HH:mm:ss'
    )
  } catch (error) {
    console.error('Error formatting date:', error)
  }
}

const setEndDate = (value: string) => {
  if (!value) {
    props.adgroup.end_date = ''
    return
  }

  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', value)
      return
    }

    // Format theo yêu cầu API: YYYY-MM-DD HH:MM:SS
    props.adgroup.end_date = formatInTimeZone(
      date,
      'UTC',
      'yyyy-MM-dd HH:mm:ss'
    )
  } catch (error) {
    console.error('Error formatting date:', error)
  }
}

const startDateForDisplay = computed(() => {
  if (!props.adgroup.start_date) return null

  try {
    // Nếu giá trị đã có format 'YYYY-MM-DD HH:mm:ss', parse trực tiếp
    if (
      props.adgroup.start_date.includes(' ') &&
      !props.adgroup.start_date.includes('T')
    ) {
      // Thêm 'T' để tạo thành ISO format
      const isoString = props.adgroup.start_date.replace(' ', 'T') + 'Z'
      return new Date(isoString)
    }

    // Nếu đã là ISO string
    return new Date(props.adgroup.start_date)
  } catch (error) {
    console.error('Error parsing start date:', error)
    return null
  }
})
const endDateForDisplay = computed(() => {
  if (!props.adgroup.end_date) return null

  try {
    // Nếu giá trị đã có format 'YYYY-MM-DD HH:mm:ss', parse trực tiếp
    if (
      props.adgroup.end_date.includes(' ') &&
      !props.adgroup.end_date.includes('T')
    ) {
      // Thêm 'T' để tạo thành ISO format
      const isoString = props.adgroup.end_date.replace(' ', 'T') + 'Z'
      return new Date(isoString)
    }

    // Nếu đã là ISO string
    return new Date(props.adgroup.end_date)
  } catch (error) {
    console.error('Error parsing end date:', error)
    return null
  }
})
const name = 'Start date'
const name2 = 'End date'
</script>

<template>
  <FloatingWrapper rounded :name="name">
    <div class="flex items-center datepicker-menu-custom w-full">
      <VueDatePicker
        :model-value="startDateForDisplay"
        format="yyyy/MM/dd HH:mm 'UTC'"
        timezone="UTC"
        utc="preserve"
        text-input
        auto-apply
        :placeholder="name"
        :min-date="yesterday()"
        class="small-datepicker"
        :disabled="
          props.FreezeData.isEditPage() &&
          (props.campaign.IsSmartCreated() ||
            (!!props.adgroup.id && !!props.adgroup.ad_group_id))
        "
        @update:model-value="setStartDate"
      >
      </VueDatePicker>
    </div>
  </FloatingWrapper>

  <FloatingWrapper rounded :name="name2">
    <div class="flex items-center datepicker-menu-custom w-full">
      <VueDatePicker
        :model-value="endDateForDisplay"
        format="yyyy/MM/dd HH:mm 'UTC'"
        timezone="UTC"
        utc="preserve"
        clearable
        auto-apply
        text-input
        :placeholder="name2"
        :min-date="yesterday()"
        class="small-datepicker"
        @update:model-value="setEndDate"
      >
      </VueDatePicker>
    </div>
  </FloatingWrapper>
</template>

<style lang="scss">
@use '@/css/DateRangerV3.scss';
</style>
