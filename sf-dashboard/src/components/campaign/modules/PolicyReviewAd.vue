<template>
  <div class="card-flex-gap-4 rounded-[5px]" v-if="ad && ad.ai_status">
    <div class="flex flex-col gap-4">
      <!-- Status section -->
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <n-dropdown trigger="hover" placement="bottom-start">
          <n-tag
            size="medium"
            :color="statusColor"
            :type="classNow"
            class="cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap n-tag-exclude"
          >
            {{ displayStatus.main }}
          </n-tag>
        </n-dropdown>
        <span
          v-if="displayStatus.note"
          class="text-xs text-gray-500 hidden sm:inline-block"
        >
          {{ displayStatus.note }}
        </span>
      </div>

      <!-- Button section nằm dưới Policy Review -->
      <div
        class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
        v-if="isShow"
      >
        <n-button
          size="small"
          type="info"
          :loading="buttonLoading.manual"
          @click="submitForm(ad.id, 'manual', 'manual')"
          class="w-full sm:w-auto"
        >
          Manual Review
        </n-button>
        <n-button
          size="small"
          type="warning"
          :loading="buttonLoading.retry"
          @click="submitForm(ad.id, 'retry', 'retry')"
          class="w-full sm:w-auto"
        >
          AI Recheck
        </n-button>
        <n-button
          size="small"
          type="success"
          :loading="buttonLoading.retry_test"
          @click="submitForm(ad.id, 'retry_test', 'retry_test')"
          class="w-full sm:w-auto"
        >
          AI Recheck Test
        </n-button>

        <n-select
          class="w-8"
          :options="promptOptions"
          v-model:value="promptTest"
          label-field="name"
          value-field="id"
          placeholder="Prompt Default"
          :loading="loadingPrompt"
          size="small"
          :consistent-menu-width="false"
          filterable
          :render-label="renderPromptLabel"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AI_STATUS } from '@/enum/campaign'
import { ctr_campaign } from '@/services/ctr_campaign'
import { statusDescriptions } from '@/types/components/campaign-v2'
import useAdDataStore from '@/store/adDataStore'
import { SelectOption } from 'naive-ui'
import { ctr_prompt } from '@/services/ctr_prompt'
import { renderPromptLabel } from '@/utils/labels'
import { TType } from '@/enum/naiveui'
const adDataStore = useAdDataStore()
const isShow = window.arb.isAdmin() || window.arb.isDev()

const props = defineProps({
  ad: {
    type: Object,
    required: true,
  },
})

const statusTagColor: Partial<
  Record<AI_STATUS, { color: string; textColor: string }>
> = {
  [AI_STATUS.BOT_REVIEW]: { color: '#dbeafe', textColor: '#2563eb' }, // xanh dương
  [AI_STATUS.MANUAL_REVIEW]: { color: '#f3e8ff', textColor: '#9333ea' }, // tím
  [AI_STATUS.AUTO_REVIEW]: { color: '#e0f2fe', textColor: '#0284c7' }, // xanh nhạt
}

const classNow = computed(() => {
  return (helper.classRender(props.ad.ai_status) as TType) || undefined
})

type ButtonLoadingKeys = 'manual' | 'retry' | 'retry_test'

const buttonLoading = ref({
  manual: false,
  retry: false,
  retry_test: false,
})

const displayStatus = computed(() => {
  const status = props.ad?.ai_status?.toLowerCase()

  // map nhanh các status đặc biệt
  const specialMap: Record<string, AI_STATUS> = {
    yes: AI_STATUS.SUCCESS,
    no: AI_STATUS.REJECTED,
    approved: AI_STATUS.SUCCESS,
  }

  const mappedStatus = specialMap[status] ?? (status as AI_STATUS)

  let current = statusDescriptions[mappedStatus] ?? {
    main: mappedStatus === AI_STATUS.REJECTED ? 'Rejected' : 'N/A',
    note: '',
  }

  // các trạng thái success/approved/yes thì luôn clear note
  if ([AI_STATUS.SUCCESS, 'approved', 'yes'].includes(status)) {
    current.note = ''
  }

  return {
    main: current.main,
    note: current.note?.replace('Campaign', 'Ad') || '',
  }
})

const statusColor = computed(() => {
  return statusTagColor[props.ad.ai_status as AI_STATUS]
})
const handleComplianceResult = (status: string, compliance?: string) => {
  switch (status) {
    case 'manual':
      props.ad.ai_status = AI_STATUS.MANUAL_REVIEW

      window.message?.success(
        'Your request has been submitted - We will notify you when this process is complete.'
      )
      break

    case 'retry':
      switch (compliance?.toLowerCase()) {
        case 'yes':
          props.ad.ai_status = AI_STATUS.SUCCESS

          window.message?.success('Ad has been approved!')
          break
        case 'no':
          props.ad.ai_status = AI_STATUS.REJECTED
          window.message?.warning('Ad has been rejected!')
          break
        default:
          break
      }
      break
  }
}

const submitForm = async (
  id_creative: number,
  status: string,
  btn: ButtonLoadingKeys
) => {
  buttonLoading.value[btn] = true
  try {
    const result = await ctr_campaign.VerifyAdGroupAd({
      id: id_creative,
      status: status,
      prompt_id: promptTest.value || undefined,
    })

    if (
      status === 'manual' &&
      result?.status &&
      result?.data.toLowerCase() === 'success'
    ) {
      {
        window.message?.info(result?.data)
        return
      }
    }

    const taskId = result?.data

    if (!taskId) {
      window.message?.error('TaskID not found.')
      return
    }

    const pollResult = await pollComplianceResult(taskId)

    if (pollResult?.data) {
      handleComplianceResult(
        status,
        pollResult.data?.ai_verify?.compliance_status
      )

      if (['retry', 'retry_test'].includes(status)) {
        openModalAd(status === 'retry_test' ? pollResult.data : undefined)
      }
    }
  } finally {
    buttonLoading.value[btn] = false
  }
}

//tăng lên 10 mins
const pollComplianceResult = async (
  taskId: string,
  interval = 2000,
  maxTry = 300
) => {
  let attempt = 0
  while (attempt < maxTry) {
    attempt++

    try {
      const res = await ctr_campaign.VerifyAdGroupAdWait(taskId)

      if (!res) {
        window.message?.error('Empty response from server.')
        break
      }

      if (!res?.status) break

      if (typeof res.data === 'string' && res.data === 'pending') {
        await new Promise((resolve) => setTimeout(resolve, interval))
        continue
      }

      return res
    } catch (error) {
      console.error(error)
      break
    }
  }
  window.message?.error('Timeout.')
}

const openModalAd = (adData?: any) => {
  if (adData) {
    adData = {
      ...adData,
      id: props.ad.id,
      creative_id: props.ad.creative_id,
      retry_test: true,
    }
  }

  adDataStore.adInfo = helper.clone(adData || props.ad)

  adDataStore.showModal = true
}

const promptOptions = ref<SelectOption[]>([])

const promptTest = ref<number | null>(null)
const loadingPrompt = ref<boolean>(false)

onMounted(async () => {
  if (isShow) {
    loadingPrompt.value = true
    const result = await ctr_prompt.GetPrompts()
    promptOptions.value = result?.data || []

    loadingPrompt.value = false
  }
})
</script>
