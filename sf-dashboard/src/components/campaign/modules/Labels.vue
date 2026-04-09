<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { ctr_label } from '@/services/ctr_label'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})
const labelOptions = ref<SelectOption[]>([])

const fetchLabel = async () => {
  isLoading.value = true

  const labelResult = await ctr_label.GetAll()

  labelOptions.value = labelResult?.data || []

  isLoading.value = false
}

const labelNow = computed<string>(() => {
  return (
    (labelOptions.value.find((label) => label.id === props.campaign?.label)
      ?.name as string) || ''
  )
})

const isLoading = ref<boolean>(false)

defineExpose({
  labelNow,
})

onMounted(() => {
  fetchLabel()
})

watch(
  () => props.statusData?.IsTabCampaign(),
  (v) => {
    if (v) {
      fetchLabel()
    }
  }
)

const name = 'Label'
</script>

<template>
  <FloatingWrapper :name="name" rounded class="name-affect-comp">
    <n-select
      v-model:value="props.campaign.label"
      filterable
      value-field="id"
      label-field="name"
      :loading="isLoading"
      :placeholder="name"
      :options="labelOptions"
    />
  </FloatingWrapper>
</template>
