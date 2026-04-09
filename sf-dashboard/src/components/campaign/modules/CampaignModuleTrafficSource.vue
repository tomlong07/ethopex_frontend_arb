<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

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

const isLoading = ref<boolean>(false)

const trafficSourceOptions = ref<SelectOption[]>([])

const fetchTrafficIsGeneral = async () => {
  isLoading.value = true
  const traffics = await ctr_filter_v2.FilterTrafficSource({
    is_general: 'on',
  })

  trafficSourceOptions.value = traffics?.data || []

  isLoading.value = false
}
onMounted(() => {
  fetchTrafficIsGeneral()
})

const name = 'Traffic Source'
</script>

<template>
  <FloatingWrapper :name="name" rounded class="name-affect-comp">
    <n-select
      v-model:value="props.campaign.traffic_source"
      :disabled="props.FreezeData.isEditPage()"
      :loading="isLoading"
      :placeholder="name"
      :options="trafficSourceOptions"
    />
  </FloatingWrapper>
</template>
