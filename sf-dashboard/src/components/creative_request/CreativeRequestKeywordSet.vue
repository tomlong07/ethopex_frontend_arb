<template>
  <div class="flex items-center">
    <FloatingWrapper :name="nameKey" rounded>
      <n-select
        v-model:value="dataConfig.creativeRequestModel.keyword_set_id"
        filterable
        remote
        :disabled="dataConfig.isCreatorMedia"
        :loading="isLoadingKeywordSet"
        :placeholder="name + ' - Default (empty keyword)'"
        :options="keywordSetOptions"
        @search="handleSearchKeywordSet"
      />
    </FloatingWrapper>
  </div>
  <n-card
    class="flex"
    v-if="dataConfig.creativeRequestModel.keyword_set_id && keywordNow"
  >
    <div class="w-1/6 font-bold">Keywords</div>
    <div class="w-full flex flex-col gap-4">
      <div
        v-for="(keyword, index) in keywordsShow"
        :key="index"
        class="flex items-center flex-row gap-2"
      >
        <n-input
          placeholder="Keyword"
          :value="keyword.keyword"
          :disabled="true"
        >
        </n-input>
      </div>
    </div>
  </n-card>
</template>
<script setup lang="ts">
import useCreativeRequestStore from '@/store/details/useCreativeStore'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const name = 'Creative Request'

const nameKey = 'Keywords Set'

const dataConfig = useCreativeRequestStore()
const isLoadingKeywordSet = ref<boolean>(true)
const keywordSetOptions = ref<SelectOption[]>([])
onMounted(async () => {
  await fetchKeywordSets()
})
const fetchKeywordSets = async (q: string = '') => {
  isLoadingKeywordSet.value = true

  keywordSetOptions.value = []
  try {
    const result = await ctr_filter_v2.FilterKeywordSet({
      q: q,
    })

    if (result?.status) {
      keywordSetOptions.value = result.data
    }
  } finally {
    isLoadingKeywordSet.value = false
  }
}
const searchTimeout = ref<ReturnType<typeof setTimeout>>()

const handleSearchKeywordSet = (query: string) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    fetchKeywordSets(query)
  }, 300)
}
const keywordNow = computed<any>(() => {
  return (
    keywordSetOptions.value.find(
      (item) => item.value === dataConfig.creativeRequestModel.keyword_set_id
    ) || {}
  )
})

const keywordsShow = computed<any[]>(() => {
  try {
    if (keywordNow.value.keyword_ab_test) {
      return JSON.parse(keywordNow.value?.keywords)
    }

    return JSON.parse(keywordNow.value?.keywords_active)
  } catch {
    return []
  }
})
</script>
