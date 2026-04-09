<script lang="ts" setup>
import { SelectOption } from 'naive-ui'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { prelanderConfigs } from '@/types/components/landing'
import FloatingWrapper from './FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: false,
  },
  landing: {
    type: Object as () => prelanderConfigs,
    required: false,
  },
  typeValue: {
    type: String,
    required: true,
  },
})

const nameDialog = 'Unlock Content Dialog'

const optionOverlay = ref<SelectOption[]>([
  { label: 'Default', value: 'default' },
  { label: 'Countdown', value: 'countdown' },
])

const countdownFields = [
  'label_scholarship',
  'label_suggested',
  'location',
  'time',
] as const

const clearCountdownData = () => {
  // Clear campaign data
  if (props.campaign?.ad_formats?.unlock_content?.dialog) {
    try {
      const dialog = props.campaign.ad_formats?.unlock_content?.dialog
      countdownFields.forEach((field) => {
        delete (dialog as any)[field]
      })
    } catch {}
  }
  // Clear landing data
  if (props.landing?.unlock_content?.dialog) {
    const dialog = props.landing.unlock_content.dialog
    countdownFields.forEach((field) => {
      delete (dialog as any)[field]
    })
  }
}

const TypeValue = computed({
  get: () => props.typeValue ?? '',
  set: (value: string) => {
    // Cập nhật type trong cả campaign và landing nếu có
    if (props.campaign?.ad_formats?.unlock_content) {
      props.campaign.ad_formats.unlock_content.type = value
    }
    if (props.landing?.unlock_content) {
      props.landing.unlock_content.type = value
    }

    if (value !== 'countdown') {
      clearCountdownData()
    }
  },
})
</script>

<template>
  <div>
    <!-- Dialog Type Selection -->

    <div class="w-64 flex-shrink-0 py-4">
      <FloatingWrapper :name="nameDialog" rounded>
        <n-select
          placeholder="Type"
          v-model:value="TypeValue"
          :options="optionOverlay"
        />
      </FloatingWrapper>
    </div>

    <DialogImage :campaign="campaign" :landing="landing" />
    <DialogHeading :campaign="campaign" :landing="landing" />
    <DialogSubHeading :campaign="campaign" :landing="landing" />

    <div v-if="TypeValue === 'countdown'">
      <DialogDeadlineMessage :campaign="campaign" :landing="landing" />
      <DialogTime :campaign="campaign" :landing="landing" />
      <DialogLabelScholarship :campaign="campaign" :landing="landing" />
      <DialogLabelSuggested :campaign="campaign" :landing="landing" />
      <DialogLocation :campaign="campaign" :landing="landing" />
    </div>

    <DialogCallToAction :campaign="campaign" :landing="landing" />
    <DialogButtonText :campaign="campaign" :landing="landing" />
  </div>
</template>
