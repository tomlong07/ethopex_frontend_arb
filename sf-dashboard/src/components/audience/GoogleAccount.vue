<script setup lang="ts">
import { googleAudienceData } from '@/types/components/google-audience'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { AudienceStateManager } from '@/types/components/audience'
import { SelectOption } from 'naive-ui'
import { TS } from '@/enum/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  audienceConfig: {
    type: Object as () => googleAudienceData,
    required: true,
  },
  stateManager: {
    type: Object as () => AudienceStateManager,
    required: true,
  },
})

const emit = defineEmits(['update:value'])
const onAccountChange = (newValue: string) => {
  emit('update:value', newValue)
}
const demandAccountOptions = ref<SelectOption[]>([])
const fetchDemandAccountOptions = async () => {
  const result = await ctr_traffic_source.GetAccount(TS.GOOGLE, '', 0)
  demandAccountOptions.value = result?.data?.accounts || []
}
onMounted(async () => {
  await fetchDemandAccountOptions()
})

const name = 'Google Account'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      v-model:value="props.audienceConfig.account_id"
      :disabled="
        props.stateManager.isEditPage() || props.stateManager.isModalMode()
      "
      filterable
      value-field="id"
      label-field="name"
      placeholder="Select traffic account"
      :options="demandAccountOptions"
      @update:value="onAccountChange"
    />
  </FloatingWrapper>
</template>
