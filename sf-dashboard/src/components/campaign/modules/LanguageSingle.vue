<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
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
const languageOptions = ref<SelectOption[]>([])

const fetchLanguageByTraffic = async () => {
  const result = await ctr_traffic_source.GetLanguage(
    props.campaign.traffic_source
  )

  languageOptions.value = result?.data?.languages || []
}

const languageOptionsShow = computed<SelectOption[]>(() => {
  const isNotSelect =
    !props.campaign?.language || !props.campaign.language.length

  if (isNotSelect) {
    return languageOptions.value
  }
  let options: SelectOption[] = []

  for (let index = 0; index < languageOptions.value.length; index++) {
    const element = helper.clone(languageOptions.value[index])
    element.disabled = true
    options.push(element)
  }

  return options
})

onMounted(async () => {
  if (props.campaign.IsAPI()) {
    if (!props.campaign.language) {
      props.campaign.language = []
    }
    await fetchLanguageByTraffic()
  }
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.language = []

      await fetchLanguageByTraffic()
    } else {
      props.campaign.language = undefined
    }
  }
)

defineExpose({
  fetchLanguageByTraffic,
})

const name = 'Language'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="props.campaign.IsAPI()"
    class="name-affect-comp"
  >
    <n-select
      v-model:value="props.campaign.language"
      filterable
      multiple
      value-field="value"
      label-field="name"
      :disabled="props.FreezeData.isEditPage()"
      :loading="isLoading"
      :placeholder="name"
      :options="languageOptionsShow"
      :clearable="true"
    />
  </FloatingWrapper>
</template>
