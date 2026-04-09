<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  adGroups,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { transformOptions } from '@/components/campaign/help/select'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
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

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI()
})

const isLoading = ref<boolean>(false)
const languageOptions = ref<SelectOption[]>([])
const languageOptionsShow = computed<SelectOption[]>(() => {
  let options: SelectOption[] = []

  if (!props.campaign.ad_groups) return options

  const isNotSelect = !props.adgroup.language?.length

  if (isNotSelect) {
    return languageOptions.value
  }
  const isHasAll = props.adgroup?.language?.includes('ALL') || false

  options = transformOptions(languageOptions, isHasAll)

  return options
})

const fetchLanguageByTraffic = async () => {
  const result = await ctr_traffic_source.GetLanguage(
    props.campaign.traffic_source
  )

  languageOptions.value = result?.data?.languages || []
}

const initLanguage = async () => {
  if (!isShow.value) return
  if (!props.campaign.ad_groups) return

  if (!props.adgroup.language) {
    props.adgroup.language = []
  }
  await fetchLanguageByTraffic()
}

watch(
  () => [props.statusData.IsTabAdGroup(), props.statusData.adGroupIndex],
  ([tab, index]) => {
    if (tab && index !== undefined && isShow.value) {
      initLanguage()
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

const name = 'Language'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="isShow && props.campaign.ad_groups"
    class="name-affect-comp"
  >
    <n-select
      v-model:value="props.adgroup.language"
      filterable
      multiple
      value-field="value"
      label-field="name"
      :loading="isLoading"
      placeholder="All Languages"
      :options="languageOptionsShow"
      :clearable="true"
      :filter="filterHandle"
    />
  </FloatingWrapper>
</template>
