<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { AddMultipleInfo } from '@/store/useCampaignAddMultiple'
import {
  creativeStruct,
  SelectOptionsManager,
} from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  adcreative: {
    type: Object as () => creativeStruct | AddMultipleInfo,
    required: true,
  },

  optionsManager: {
    type: Object as () => SelectOptionsManager,
    required: true,
  },
})

const isLoading = ref(false)

const fanpageOptions = ref<SelectOption[]>([])

const updateFanpage = (value: string) => {
  props.adcreative.fanpage = value

  if ('post_id' in props.adcreative) {
    props.adcreative.post_id = null
  }
}

watch(
  () => props.optionsManager.loadingFanpage,
  (newVal, oldVal) => {
    if (!newVal) {
      fanpageOptions.value = props.optionsManager.fanpageOptions
    }
  }
)

const fetchFanpageOptions = async (q?: string) => {
  isLoading.value = true
  const result = await ctr_traffic_source.GetFacebookPage(
    { ids: props.adcreative.fanpage, q: q },
    {}
  )
  fanpageOptions.value = result?.data || []
  isLoading.value = false
}

const handleSearchFanpage = debounceV2(async (query?: string) => {
  fetchFanpageOptions(query)
}, 300)

onMounted(async () => {
  fanpageOptions.value = helper.clone(props.optionsManager.fanpageOptions)
})

const name = 'Fanpage'

watch(
  () => props.adcreative,
  (newVal) => {
    if (!newVal?.fanpage) {
      props.adcreative.fanpage = null
    }
  }
)
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <n-select
      value-field="post_id"
      label-field="name"
      filterable
      remote
      v-model:value="props.adcreative.fanpage"
      :placeholder="name"
      :loading="isLoading"
      :options="fanpageOptions"
      @search="handleSearchFanpage"
      :on-update:value="updateFanpage"
    />
  </FloatingWrapper>
</template>
