<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { ctr_audience } from '@/services/ctr_audience'
import { TS } from '@/enum/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const isLoading = ref(false)
const AudienceOptions = ref<SelectOption[]>([])

const fetchAudienceOptions = async () => {
  if (!props.campaign.account_supply_id) {
    return
  }

  const audienceResult = await ctr_audience.Filter({
    filter: {
      account_id: props.campaign.account_supply_id,
      traffic_source: TS.GOOGLE,
    },
  })

  AudienceOptions.value = audienceResult?.data?.items || []
}

onMounted(async () => {
  if (isShow.value) {
    fetchAudienceOptions()
  }
})

const isShow = computed<boolean>(() => {
  if (props.FreezeData.isAddPage()) {
    return false
  }

  if (
    props.FreezeData.isEditPage() &&
    props.campaign.IsDemandGen() &&
    props.campaign.audience
  )
    return true

  return false
})

const name = 'Audience'
</script>
<!-- Dùng cho camp cũ vẫn có audience vẫn hiển thị bình thường -->
<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <div class="w-40 font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0 flex flex-row gap-2">
      <n-select
        v-model:value="props.campaign.audience"
        filterable
        value-field="id"
        label-field="name"
        :loading="isLoading"
        :options="AudienceOptions"
        :placeholder="name"
        :disabled="true"
      />
    </div>
  </div>
</template>
<style lang="scss">
// Hide the select all button because it doesn’t work correctly—it will unnecessarily select parent nodes that shouldn’t be selected, and the button isn’t really needed anyway.
.transfer-parent-audience.n-transfer .n-transfer-list .n-transfer-list-header {
  display: none;
}

.transfer-parent-audience.n-transfer
  .n-transfer-list
  .n-transfer-list-body
  .n-transfer-list-flex-container {
  margin-top: 1rem;
}
</style>
