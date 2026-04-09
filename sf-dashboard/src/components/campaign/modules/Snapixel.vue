<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})
const OptionGetAccountId = ref<SelectOption[]>([])
const isLoading = ref(false)

const getPixelSnapchatByAccount = async (account: string) => {
  if (!account) return

  isLoading.value = true
  try {
    const result = await ctr_traffic_source.AccountIdGet(account)
    const pixelOptions: SelectOption[] = result?.data || []
    OptionGetAccountId.value = pixelOptions

    if (props.campaign.snap_pixel) {
      const idValid = pixelOptions.map((isd) => isd.id)
      if (!idValid.includes(props.campaign.snap_pixel)) {
        props.campaign.snap_pixel = null
      }
    }
    if (pixelOptions.length === 0) {
      props.campaign.snap_pixel = null
    }
  } catch {
    return
  } finally {
    isLoading.value = false
  }
}

const accountCategoryIdNow = computed(() =>
  props.statusData.getAccountCategoryIdNow(props.campaign.account_supply_id)
)

watch(
  () => accountCategoryIdNow.value,
  (newVal) => {
    getPixelSnapchatByAccount(newVal)
  }
)
</script>

<template>
  <FloatingWrapper name="Snap Pixel" rounded v-if="props.campaign.IsAPI()">
    <n-select
      v-model:value="campaign.snap_pixel"
      clearable
      filterable
      value-field="id"
      label-field="name"
      :disabled="props.isDisabled"
      :loading="isLoading"
      :options="OptionGetAccountId"
    />
  </FloatingWrapper>
</template>
