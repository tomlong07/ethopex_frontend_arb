<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  adGroups,
} from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { linkField } from './helpers'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  adGroup: {
    type: Object as () => adGroups,
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

const languages = linkField<string[] | undefined>('language', [
  () => props.adGroup,
])

const ensureLanguages = () => {
  if (!Array.isArray(languages.value)) {
    languages.value = []
  }
}

const updateLanguages = (next: string[] | undefined) => {
  if (Array.isArray(next)) {
    languages.value = [...next]
    return
  }
  languages.value = next
}

const getSelectedLanguages = () =>
  Array.isArray(languages.value) ? languages.value : []

const languageOptionsShow = computed<SelectOption[]>(() => {
  const selected = getSelectedLanguages()
  const isNotSelect = !selected.length

  if (isNotSelect) {
    // Tạm thời loại bỏ "ALL" option
    return languageOptions.value.filter((option) => option.value !== 'ALL')
  }
  // const isHasAll = selected.includes('ALL')

  // let options: SelectOption[] = []

  // for (let index = 0; index < languageOptions.value.length; index++) {
  //   const element = helper.clone(languageOptions.value[index])
  //   if (isHasAll) {
  //     if (element.value === 'ALL') {
  //       options.push(element)
  //     } else {
  //       element.disabled = true
  //       options.push(element)
  //     }
  //   } else {
  //     if (element.value === 'ALL') {
  //       element.disabled = true

  //       options.push(element)
  //     } else {
  //       options.push(element)
  //     }
  //   }
  // }

  // return options

  // Tạm thời loại bỏ "ALL" và không có logic disable
  return languageOptions.value.filter((option) => option.value !== 'ALL')
})

const fetchLanguageByTraffic = async () => {
  const result = await ctr_traffic_source.GetLanguage(
    props.campaign.traffic_source
  )

  languageOptions.value = result?.data?.languages || []
}

onMounted(async () => {
  if (isShow.value) {
    ensureLanguages()
    await fetchLanguageByTraffic()
  }
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      updateLanguages([])

      await fetchLanguageByTraffic()
    } else {
      updateLanguages(undefined)
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
  <FloatingWrapper :name="name" rounded v-if="isShow" class="name-affect-comp">
    <n-select
      v-model:value="languages"
      filterable
      multiple
      value-field="value"
      label-field="name"
      :disabled="props.FreezeData.isEditPage() && !!adGroup.id"
      :loading="isLoading"
      :placeholder="name"
      :options="languageOptionsShow"
      :clearable="true"
      :filter="filterHandle"
    />
  </FloatingWrapper>
</template>
