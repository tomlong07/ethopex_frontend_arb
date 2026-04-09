<script setup lang="ts">
import { AI_STATUS } from '@/enum/campaign'
import { TType } from '@/enum/naiveui'
import { ctr_campaign } from '@/services/ctr_campaign'
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
  statusDescriptions,
} from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const statusTagColor: Partial<
  Record<AI_STATUS, { color: string; textColor: string }>
> = {
  // [AI_STATUS.SUCCESS]: { color: '#dcfce7', textColor: '#16a34a' }, // xanh lá
  // [AI_STATUS.PENDING]: { color: '#fef9c3', textColor: '#ca8a04' }, // vàng
  [AI_STATUS.BOT_REVIEW]: { color: '#dbeafe', textColor: '#2563eb' }, // xanh dương
  [AI_STATUS.MANUAL_REVIEW]: { color: '#f3e8ff', textColor: '#9333ea' }, // tím
  // [AI_STATUS.REJECTED]: { color: '#fee2e2', textColor: '#dc2626' }, // đỏ
  [AI_STATUS.AUTO_REVIEW]: { color: '#e0f2fe', textColor: '#0284c7' }, // xanh nhạt
}

const classNow = (status: string) => {
  return (helper.classRender(status) as TType) || undefined
}

type ButtonLoadingKeys = 'manual' | 'recheck'

const buttonLoading = ref({
  manual: false,
  recheck: false,
})

const submitForm = async (status: AI_STATUS, btn: ButtonLoadingKeys) => {
  buttonLoading.value[btn] = true
  try {
    const result = await ctr_campaign.ChangeAiStatus({
      id: props.campaign.id,
      ai_status: status,
    })

    if (result?.status) {
      window.message.success(
        'Your request has been submitted - We will notify you when this process is complete.'
      )
      props.campaign.ai_status = status
    }
  } finally {
    buttonLoading.value[btn] = false
  }
}

const currentStatusParts = computed(() => {
  const creatives =
    props.campaign?.ad_groups?.flatMap(
      (group: any) => group.ad_creative || []
    ) || []

  const hasManual = creatives.some(
    (creative: any) => creative.ai_status === AI_STATUS.MANUAL_REVIEW
  )

  const status = (
    hasManual ? AI_STATUS.MANUAL_REVIEW : props.campaign?.ai_status || ''
  ) as AI_STATUS

  return statusDescriptions[status] || { main: '', note: '', type: '' }
})
</script>

<template>
  <n-card
    title=""
    class="card-flex-gap-4 rounded-[5px] !border-gray2"
    v-if="FreezeData.isEditPage() && currentStatusParts.type"
  >
    <div class="flex items-center gap-2">
      <div class="w-40 font-bold">Policy Review</div>
      <div class="flex-1 min-w-0 flex items-center gap-2">
        <n-tag
          size="medium"
          :color="statusTagColor[currentStatusParts.type as AI_STATUS]"
          :type="classNow(currentStatusParts.type)"
          class="n-tag-exclude"
        >
          {{ currentStatusParts.main }}
        </n-tag>
        <span v-if="currentStatusParts.note" class="text-xs text-gray-500">
          {{ currentStatusParts.note }}
        </span>
      </div>
    </div>

    <div
      class="mt-2 p-3 bg-amber-50 rounded border border-amber-200"
      v-if="props.campaign.ai_status === AI_STATUS.REJECTED"
    >
      <div class="flex items-start space-x-3">
        <div
          class="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        >
          !
        </div>
        <div class="flex-1">
          <h4
            class="text-sm font-semibold text-amber-800 mb-2 font-bold-exclude"
          >
            Your campaign has been rejected
          </h4>
          <p class="text-sm text-amber-700 mb-3">
            One or more ads did not meet compliance requirements during the AI
            review.
          </p>
          <div class="text-sm text-amber-700 mb-3">
            <p class="font-medium mb-2">You can:</p>
            <ul class="space-y-1">
              <li class="flex items-start">
                <span class="text-amber-500 mr-2">•</span>
                <span
                  ><strong>Edit and resubmit</strong> the rejected ads.</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-amber-500 mr-2">•</span>
                <span
                  ><strong>Request an AI recheck</strong> if you believe the AI
                  may have made a mistake.</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-amber-500 mr-2">•</span>
                <span
                  ><strong>Request a manual review</strong> to have a human
                  reviewer check your ads.</span
                >
              </li>
            </ul>
          </div>
          <div class="flex gap-2">
            <n-button
              type="primary"
              size="medium"
              :loading="buttonLoading.manual"
              @click="submitForm(AI_STATUS.MANUAL_REVIEW, 'manual')"
            >
              Request Manual Review
            </n-button>
            <n-button
              type="warning"
              size="medium"
              :loading="buttonLoading.recheck"
              @click="submitForm(AI_STATUS.BOT_REVIEW, 'recheck')"
            >
              Request AI Recheck
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>
