<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { ctr_campaign } from '@/services/ctr_campaign'
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
const tagOptions = ref<SelectOption[]>([])
const tagSearchOpts = ref<SelectOption[]>([])

const fetchTag = async (value: string = '') => {
  isLoading.value = true

  const result = await ctr_campaign.SearchTag({ search: value })

  const isSelectedOpts = result?.data?.length
    ? result.data.map((item: any) => ({
        label: item,
        value: item,
      }))
    : []

  const isSearch = value !== ''
  if (isSearch) {
    const merged = [...tagOptions.value, ...isSelectedOpts]
    // Lọc trùng value
    tagOptions.value = merged.filter(
      (v, i, arr) => arr.findIndex((x) => x.value === v.value) === i
    )

    tagSearchOpts.value = isSelectedOpts
  } else {
    tagOptions.value = isSelectedOpts
  }

  isLoading.value = false
}

const isLoading = ref<boolean>(false)

if (tagSearchOpts.value.length) {
  tagOptions.value = tagSearchOpts.value
}
const handleUpdateTags = (val: string[]) => {
  props.campaign.tags = val.filter((tag) => tag.trim() !== '')
}

watch(
  () => props.statusData.IsTabCampaign(),
  (v) => {
    if (v) {
      fetchTag()
    }
  },
  { deep: true }
)

const handleSearch = debounceV2((value: any) => {
  fetchTag(value)
}, 300)
const name = 'Tags'
</script>

<template>
  <FloatingWrapper v-if="!campaign.IsAPIPublic()" :name="name" rounded>
    <n-select
      v-model:value="props.campaign.tags"
      filterable
      clearable
      multiple
      tag
      :loading="isLoading"
      :placeholder="name"
      :options="tagOptions"
      @search="(q:string)=>handleSearch(q)"
      @update:value="handleUpdateTags"
    >
      <template #empty>Enter text to add new tags</template>
    </n-select>
  </FloatingWrapper>
</template>
