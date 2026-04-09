<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { FreezeClass, adGroups } from '@/types/components/campaign-v2'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format, subDays } from 'date-fns'

import { utcToZonedTime } from 'date-fns-tz'

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

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const setStartDate = (value: string) => {
  const newValue = helper.formatToUTC(value)

  if (!newValue) {
    console.error('Invalid setStartDate')
  }

  props.adgroup.start_date = newValue || ''
}

const setEndDate = (value: string) => {
  const newValue = helper.formatToUTC(value)

  if (!newValue) {
    console.error('Invalid setEndDate')
  }

  props.adgroup.end_date = newValue || ''
}

const name = 'Start date'
const name2 = 'End date'
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <div class="flex items-center datepicker-menu-custom w-52">
      <VueDatePicker
        :model-value="props.adgroup.start_date"
        format="yyyy/MM/dd HH:mm 'UTC'"
        timezone="UTC"
        utc="preserve"
        clearable
        auto-apply
        text-input
        :placeholder="name"
        :min-date="yesterday()"
        class="small-datepicker"
        :disabled="
          props.FreezeData.isEditPage() &&
          !!props.adgroup.id &&
          !!props.adgroup.ad_group_id
        "
        @update:model-value="setStartDate"
      >
        <template #clear-icon="{ clear }"> &nbsp; </template>
      </VueDatePicker>
    </div>
  </FloatingWrapper>

  <FloatingWrapper :name="name2" rounded>
    <div class="flex items-center datepicker-menu-custom w-52">
      <VueDatePicker
        :model-value="props.adgroup.end_date"
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
        <template #clear-icon="{ clear }"> &nbsp; </template>
      </VueDatePicker>
    </div>
  </FloatingWrapper>
</template>

<style lang="scss">
@use '@/css/DateRangerV3.scss';
</style>
