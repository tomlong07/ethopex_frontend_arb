<script lang="ts" setup>
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { prelanderConfigs } from '@/types/components/landing'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: false,
  },
  landing: {
    type: Object as () => prelanderConfigs,
    required: false,
  },
})

const dialog = computed(() => {
  const unlockContent =
    props.campaign?.ad_formats?.unlock_content || props.landing?.unlock_content
  return unlockContent?.dialog
})

const timeConfig = [
  { key: 'days', label: 'Days', max: 3650, multiplier: 24 * 60 },
  { key: 'hours', label: 'Hours', max: 24, multiplier: 60 },
  { key: 'minutes', label: 'Minutes', max: 60, multiplier: 1 },
] as const

const timeValues = ref({
  days: 0,
  hours: 0,
  minutes: 0,
})

// Chuyển đổi ngày, giờ, phút thành tổng số phút
const convertTimeToMinutes = computed(() => {
  return timeConfig.reduce((total, config) => {
    return total + timeValues.value[config.key] * config.multiplier
  }, 0)
})

const formattedMinutes = computed(() =>
  new Intl.NumberFormat('en-US').format(convertTimeToMinutes.value)
)

// Function để cập nhật countdown time
const updateCountdownTime = () => {
  const totalMinutes = convertTimeToMinutes.value

  // Cập nhật time cho cả campaign và landing
  if (props.campaign?.ad_formats?.unlock_content?.dialog) {
    props.campaign.ad_formats.unlock_content.dialog.time = totalMinutes
  }

  if (props.landing?.unlock_content?.dialog) {
    props.landing.unlock_content.dialog.time = totalMinutes
  }
}

// Initialize timeValues from existing data
onMounted(() => {
  const existingTime = dialog.value?.time || 0
  if (existingTime > 0) {
    const days = Math.floor(existingTime / (24 * 60))
    const hours = Math.floor((existingTime % (24 * 60)) / 60)
    const minutes = existingTime % 60

    timeValues.value = { days, hours, minutes }
  }
})
const name = 'Time'
</script>

<template>
  <div class="flex items-center mb-2">
    <div class="flex flex-row place-items-center gap-4 flex-1 min-w-0">
      <div class="flex-1 min-w-0">
        <div class="w-40 flex-shrink-0"></div>

        <div class="space-y-3 mb-2">
          <FloatingWrapper :name="name" medium rounded>
            <div class="rounded-md p-4 border border-gray-200">
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="config in timeConfig"
                  :key="config.key"
                  class="text-center"
                >
                  <div class="flex items-center justify-center">
                    <FloatingWrapper :name="config.label" medium rounded>
                      <n-input-number
                        v-model:value="timeValues[config.key]"
                        :min="0"
                        :max="config.max"
                        size="small"
                        class="w-full"
                        @update:value="updateCountdownTime"
                      />
                    </FloatingWrapper>
                  </div>
                </div>
              </div>
            </div>
          </FloatingWrapper>

          <div
            class="text-xs text-gray-500 text-center bg-blue-50 rounded-md px-3 py-2"
          >
            <span class="font-medium">Total:</span>
            {{ formattedMinutes }} minutes
            <span v-if="convertTimeToMinutes > 0">
              ({{ timeValues.days }}day {{ timeValues.hours }}hours
              {{ timeValues.minutes }}minutes)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
