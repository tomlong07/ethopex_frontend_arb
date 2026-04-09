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

const unlockContent = computed(() => {
  return (
    props.campaign?.ad_formats?.unlock_content || props.landing?.unlock_content
  )
})

const dialog = computed(() => {
  return unlockContent.value?.dialog
})

const headingValue = computed({
  get: () => dialog.value?.label_scholarship || '',
  set: (value: string) => {
    if (props.campaign?.ad_formats?.unlock_content?.dialog) {
      props.campaign.ad_formats.unlock_content.dialog.label_scholarship = value
    }
    if (props.landing?.unlock_content?.dialog) {
      props.landing.unlock_content.dialog.label_scholarship = value
    }
  },
})

const name = 'Benefit 1'
const MAX_LENGTH = 80
</script>

<template>
  <div class="flex items-center mb-2">
    <div class="flex flex-row place-items-center gap-4 flex-1 min-w-0">
      <div class="flex-1 min-w-0">
        <div class="flex flex-col gap-2" v-if="unlockContent">
          <div class="flex flex-row gap-2 items-center">
            <FloatingWrapper :name="name" medium rounded>
              <n-input
                v-model:value="headingValue"
                :placeholder="name"
                :maxlength="MAX_LENGTH"
                show-count
                class="w-full"
              />
            </FloatingWrapper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
