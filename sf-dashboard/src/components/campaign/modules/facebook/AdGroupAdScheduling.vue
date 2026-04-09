<script lang="ts" setup>
import {
  FreezeClass,
  adGroups,
  campaignTypeClass,
} from '@/types/components/campaign-v2'
import Note from '@/components/helpers/Note.vue'
import { SelectOption } from 'naive-ui'
import { TIME_ZONE_TYPE } from '@/enum/campaign'
import AdGroupScheduleHour from '@/components/campaign/modules/facebook/AdGroupScheduleHour.vue'
import { timeZoneTypeOptions } from '@/options/campaign'

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

const isShow = computed(() => {
  return (
    props.campaign.bidding == 'LIFETIME_BUDGET' ||
    props.adgroup.bidding === 'LIFETIME_BUDGET'
  )
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    props.adgroup.schedule = {}
  }
)

const handleDayparting = (value: boolean) => {
  if (props.adgroup.schedule) {
    props.adgroup.schedule.show_dayparting = value
    if (value) {
      props.adgroup.schedule.time_zone_type = TIME_ZONE_TYPE.USER
      props.adgroup.schedule.dayparting = Array(8 * 24).fill('0')
    } else {
      props.adgroup.schedule.time_zone_type = undefined
      props.adgroup.schedule.dayparting = undefined
    }
  }
}

const name = 'Ad scheduling'
</script>

<template>
  <div class="flex flex-col gap-2" v-if="isShow">
    <div class="font-bold flex items-center gap-2">
      {{ name }}

      <Note
        text="Schedule your ads to run during specific hours and days of the week."
      />
    </div>
    <div class="flex flex-col gap-2" v-if="props.adgroup.schedule">
      <n-checkbox
        v-model:checked="props.adgroup.schedule.show_dayparting"
        :on-update:checked="handleDayparting"
      >
        Run ads on a schedule
      </n-checkbox>

      <div
        v-if="props.adgroup.schedule.show_dayparting"
        class="flex gap-4 flex-col"
      >
        <n-select
          v-model:value="props.adgroup.schedule.time_zone_type"
          :options="timeZoneTypeOptions"
        />

        <n-alert type="info"
          >Click and drag to schedule multiple times at once.
        </n-alert>

        <AdGroupScheduleHour
          :adgroup="props.adgroup"
          :FreezeData="props.FreezeData"
        />
      </div>
    </div>
  </div>
</template>
