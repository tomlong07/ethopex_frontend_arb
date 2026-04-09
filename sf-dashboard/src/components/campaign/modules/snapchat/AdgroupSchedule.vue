<script setup lang="ts">
import { computed } from 'vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import {
  FreezeClass,
  adGroups,
  campaignTypeClass,
} from '@/types/components/campaign-v2'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { max, startOfDay } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: false,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: false,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const targetEntity = computed<Record<string, any> | null>(
  () => props.adgroup ?? props.campaign ?? null
)
const isAdGroup = computed(() => Boolean(props.adgroup))
const isCampaignSmart = computed(() =>
  props.campaign?.IsSmartCreated ? props.campaign.IsSmartCreated() : false
)

const parseStoredDate = (value?: string | null) => {
  if (!value) return null

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatUtcIso = (date: Date) =>
  formatInTimeZone(date, 'UTC', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

const makeUpdateHandler =
  (field: 'start_date' | 'end_date') => (value: Date | null) => {
    const target = targetEntity.value
    if (!target) return

    if (!value) {
      target[field] = ''
      return
    }

    const normalized = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(normalized.getTime())) {
      console.error('Invalid date:', value)
      return
    }

    target[field] = formatUtcIso(normalized)
  }

const startTimeForDisplay = computed(() =>
  parseStoredDate(targetEntity.value?.start_date)
)
const endTimeForDisplay = computed(() =>
  parseStoredDate(targetEntity.value?.end_date)
)

const updateStartTime = makeUpdateHandler('start_date')
const updateEndTime = makeUpdateHandler('end_date')

const todayAtUtc = computed(() => startOfDay(new Date()))
const minStartDate = todayAtUtc
const minEndDate = computed(() => {
  const startDate = startTimeForDisplay.value
  return startDate ? max([startDate, todayAtUtc.value]) : todayAtUtc.value
})

const startLabel = 'Start time'
const endLabel = 'End time'

const isPickerDisabled = computed(() => {
  if (!props.FreezeData.isEditPage()) return false
  if (isAdGroup.value) {
    const adGroup = props.adgroup
    return isCampaignSmart.value || (!!adGroup?.id && !!adGroup?.ad_group_id)
  }

  return isCampaignSmart.value
})
</script>

<template>
  <FloatingWrapper rounded :name="startLabel">
    <div class="flex items-center datepicker-menu-custom w-full">
      <VueDatePicker
        :model-value="startTimeForDisplay"
        format="yyyy/MM/dd HH:mm:ss 'UTC'"
        timezone="UTC"
        utc="preserve"
        text-input
        auto-apply
        :placeholder="startLabel"
        :min-date="minStartDate"
        class="small-datepicker"
        :disabled="isPickerDisabled"
        @update:model-value="updateStartTime"
      >
      </VueDatePicker>
    </div>
  </FloatingWrapper>

  <FloatingWrapper rounded :name="endLabel">
    <div class="flex items-center datepicker-menu-custom w-full">
      <VueDatePicker
        :model-value="endTimeForDisplay"
        format="yyyy/MM/dd HH:mm:ss 'UTC'"
        timezone="UTC"
        utc="preserve"
        clearable
        auto-apply
        text-input
        :placeholder="endLabel"
        :min-date="minEndDate"
        class="small-datepicker"
        @update:model-value="updateEndTime"
      >
      </VueDatePicker>
    </div>
  </FloatingWrapper>
</template>

<style lang="scss">
@use '@/css/DateRangerV3.scss';
</style>
