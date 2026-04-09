<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import modalCrawlCamp from '@/store/modalCrawlCamp'
import { SelectOption } from 'naive-ui'

const storeModalCrawl = modalCrawlCamp()

const keywordSetOptions = ref<SelectOption[]>([])
const name = 'Keyword Set'

const isLoading = ref<boolean>(false)

const fetchKeywordSets = async (q: string = '') => {
  isLoading.value = true

  keywordSetOptions.value = []
  try {
    const result = await ctr_filter_v2.FilterKeywordSet({
      q: q,
      f: storeModalCrawl.dataCrawlCamp.keyword_set_id
        ? String(storeModalCrawl.dataCrawlCamp.keyword_set_id)
        : undefined,
    })

    if (result?.status) {
      keywordSetOptions.value = result.data
    }
  } finally {
    isLoading.value = false
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

onMounted(() => {
  fetchKeywordSets()
})
</script>

<template>
   <FloatingWrapper :name="name">
      <n-select
        v-model:value="storeModalCrawl.dataCrawlCamp.keyword_set_id"
        filterable
        remote
        clearable
        :loading="isLoading"
        :placeholder="name + ' - Default (empty keyword)'"
        :options="keywordSetOptions"
        @search="handleSearchKeywordSet"
      />
    </FloatingWrapper>
</template>
