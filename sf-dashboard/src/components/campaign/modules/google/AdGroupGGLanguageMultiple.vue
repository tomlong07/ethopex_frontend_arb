<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { transformOptions } from '@/components/campaign/help/select'
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

  index: {
    type: Number,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI() && props.campaign.IsDemandGen()
})

const isLoading = ref<boolean>(false)
const languageOptions = ref<SelectOption[]>([])
const languageOptionsShow = computed<SelectOption[]>(() => {
  let options: SelectOption[] = []

  if (!props.campaign.ad_groups) return options

  const isNotSelect = !props.campaign.ad_groups[props.index].language?.length

  if (isNotSelect) {
    return languageOptions.value
  }
  const isHasAll =
    props.campaign.ad_groups[props.index]?.language?.includes('ALL') || false

  options = transformOptions(languageOptions, isHasAll)

  return options
})

const fetchLanguageByTraffic = async () => {
  const result = await ctr_traffic_source.GetLanguage(
    props.campaign.traffic_source
  )

  languageOptions.value = result?.data?.languages || []
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (!newValue && props.campaign.ad_groups) {
      props.campaign.ad_groups[props.index].language = undefined
    }
  }
)

watch(
  () => [props.statusData.adGroupIndex, props.statusData.IsTabAdGroup()],
  async ([index, IsTabAdGroup]) => {
    if (index !== null && IsTabAdGroup && isShow.value) {
      if (props.campaign.ad_groups) {
        if (!props.campaign.ad_groups[props.index].language) {
          props.campaign.ad_groups[props.index].language = []
        }
      }
      await fetchLanguageByTraffic()
    }
  }
)

const filterHandle = (pattern: string, option: any) => {
  return (
    option?.name?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.code2?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.value?.toLowerCase().includes(pattern.toLowerCase())
  )
}

defineExpose({
  fetchLanguageByTraffic,
})

const name = 'Language'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="isShow && props.campaign.ad_groups"
  >
    <n-select
      v-model:value="props.campaign.ad_groups[props.index].language"
      filterable
      multiple
      value-field="value"
      label-field="name"
      :loading="isLoading"
      :placeholder="name"
      :options="languageOptionsShow"
      :clearable="true"
      :filter="filterHandle"
    />
  </FloatingWrapper>
</template>
