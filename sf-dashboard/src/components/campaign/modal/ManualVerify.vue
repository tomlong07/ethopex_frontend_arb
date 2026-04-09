<script lang="ts" setup>
import Send from '@/assets/icons/Send.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import useCampaign2Store from '@/store/useCampaign2Store'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ManualVerifyOptions } from '@/options/campaign'
const campaign2Store = useCampaign2Store()
// asdasd
const props = defineProps({
  ts: {
    type: String,
    required: true,
  },
  creative_id: {
    type: Number,
    required: false,
  },
})

const status = ref(null)
const reason = ref('')

const hasPermission = ref(false)
const isLoadingPermission = ref(false)
const isSubmitting = ref(false)

const fetchPermission = async () => {
  isLoadingPermission.value = true
  const result = await ctr_campaign.CampaignConfigs({ verify: true })
  hasPermission.value = result?.data?.verify_ad_creative

  isLoadingPermission.value = false
}

const renderLabel = (option: { label: string; value: string }) => {
  return h(
    'div',
    {
      class: [
        'flex',
        option.value === 'approved' ? 'text-green-500' : 'text-red-500',
      ],
    },
    [h('span', {}, option.label)]
  )
}

onMounted(async () => {
  await fetchPermission()
})

const submitForm = async () => {
  if (!props.creative_id) {
    window.message.error('Creative ID not found')
    return
  }
  isSubmitting.value = true

  const result = await ctr_campaign.VerifyAdsCreative({
    creative_id: props.creative_id,
    status: status.value,
    reason: reason.value,
  })

  if (result?.status) {
    window.message.success('Ad creative verified successfully')
    campaign2Store.showModalAd = false

    emit('finishAction')
  }
  isSubmitting.value = false
}

const emit = defineEmits<{
  (e: 'finishAction'): void
}>()
</script>

<template>
  <div class="flex flex-row items-center gap-2 p-6 pb-4" v-if="hasPermission">
    <div class="w-32">
      <FloatingWrapper name="Status"
        ><n-select
          v-model:value="status"
          :options="ManualVerifyOptions"
          :loading="isLoadingPermission"
          :render-label="renderLabel"
          placeholder="Select status"
      /></FloatingWrapper>
    </div>
    <div class="flex-1 min-w-0">
      <FloatingWrapper name="Reason">
        <n-input v-model:value="reason" placeholder="Reason" maxlength="500"
      /></FloatingWrapper>
    </div>
    <n-button
      class="w-24"
      color="#f43f5e"
      size="medium"
      type="success"
      :loading="isSubmitting"
      @click="submitForm"
      icon-placement="right"
    >
      Send
      <template #icon>
        <n-icon>
          <Send />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>
