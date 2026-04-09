<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
const isShow = computed<boolean>(() => {
  if (props.campaign.IsDemandGen()) {
    return false
  }

  return props.campaign.IsAPI()
})

const isLoading = ref<boolean>(false)
const languageOptions = ref<SelectOption[]>([])
const languageOptionsShow = computed<SelectOption[]>(() => {
  const isNotSelect = !props.adgroup?.language || !props.adgroup.language.length

  if (isNotSelect) {
    return languageOptions.value
  }
  const isHasAll = props.adgroup?.language?.includes('ALL')

  let options: SelectOption[] = []

  for (let index = 0; index < languageOptions.value.length; index++) {
    const element = helper.clone(languageOptions.value[index])
    if (isHasAll) {
      if (element.value === 'ALL') {
        options.push(element)
      } else {
        element.disabled = true
        options.push(element)
      }
    } else {
      if (element.value === 'ALL') {
        element.disabled = true

        options.push(element)
      } else {
        options.push(element)
      }
    }
  }

  return options
})

const fetchLanguageByTraffic = async () => {
  const result = await ctr_traffic_source.GetLanguage(
    props.campaign.traffic_source
  )

  languageOptions.value = result?.data?.languages || []
}

onMounted(async () => {
  if (isShow.value) {
    if (!props.adgroup.language) {
      props.adgroup.language = []
    }
    await fetchLanguageByTraffic()
  }
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.language = []

      await fetchLanguageByTraffic()
    } else {
      props.adgroup.language = undefined
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
  <div class="flex items-center name-affect-comp gap-2" v-if="isShow">
    <FloatingWrapper :name="name" rounded required>
      <div class="flex-1 min-w-0 flex items-center">
        <n-select
          v-model:value="props.adgroup.language"
          filterable
          multiple
          value-field="value"
          label-field="name"
          :loading="isLoading"
          :placeholder="name"
          :options="languageOptionsShow"
          :clearable="true"
          :filter="filterHandle"
          :max-tag-count="5"
        />
      </div>
    </FloatingWrapper>
  </div>
</template>
