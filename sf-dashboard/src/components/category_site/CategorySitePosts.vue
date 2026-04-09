<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'
import { storeToRefs } from 'pinia'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const categorySiteStore = useCategorySite()
const { categorySite, landingOptions } = storeToRefs(categorySiteStore)

const isLoading = ref(false)

const fetchLandingPageByDemand = async (q: string = '') => {
  isLoading.value = true

  await categorySiteStore.fetchLandingPageByDemand(q)
  isLoading.value = false
}

const handleLandingSearch = debounceV2(async (q: string = '') => {
  await fetchLandingPageByDemand(q)
}, 300)

watch(
  () => categorySiteStore.isLoadingPage,
  async (newValue, oldValue) => {
    if (!newValue && oldValue) {
      await fetchLandingPageByDemand()
    }
  }
)

onMounted(async () => {
  if (categorySiteStore.isAddPage) {
    await fetchLandingPageByDemand()
  }
})

const renderLandingLabel = (option: SelectOption) => {
  return h('div', { class: 'flex justify-between items-center w-full' }, [
    h('span', { class: 'text-sm truncate' }, option.label as string),
    h('span', { class: 'text-xs text-gray-400 ml-2' }, option.value),
  ])
}
</script>

<template>
  <div class="flex items-center mb-4">
    <FloatingWrapper>
      <div class="w-full flex items-end gap-1">
        <n-select
          v-model:value="categorySite.posts"
          :options="landingOptions"
          multiple
          clearable
          remote
          filterable
          :loading="isLoading"
          placeholder="Select landing pages"
          @search="handleLandingSearch"
          max-tag-count="responsive"
          :render-label="renderLandingLabel"
        />
      </div>
    </FloatingWrapper>
  </div>
</template>
