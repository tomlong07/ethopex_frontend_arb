<script setup lang="ts">
import JsonFormatter from '@/components/tool_dev/JsonFormatter.vue'
import UrlParser from '@/components/tool_dev/UrlParser.vue'
import TextCompare from '@/components/tool_dev/TextCompare.vue'
import { N } from '@/enum/tool'

const activeTab = ref<N>(N.JSON)
const isLoading = ref<boolean>(true)

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case N.JSON:
      return JsonFormatter
    case N.URL:
      return UrlParser
    case N.COMPARE:
      return TextCompare
    default:
      return JsonFormatter
  }
})

const updateUrlParam = (tab: N) => {
  const url = new URL(window.location.href)

  url.searchParams.delete(N.JSON)
  url.searchParams.delete(N.URL)
  url.searchParams.delete(N.COMPARE)

  switch (tab) {
    case N.JSON:
      url.searchParams.set(N.JSON, '')
      break
    case N.URL:
      url.searchParams.set(N.URL, '')
      break
    case N.COMPARE:
      url.searchParams.set(N.COMPARE, '')
      break
  }
  const cleanParams = url.searchParams.toString().replace(/=(&|$)/g, '$1')

  const newUrl = `${window.location.pathname}${
    cleanParams ? '?' + cleanParams : ''
  }`
  window.history.pushState({}, '', newUrl)
}

const handleTabChange = (tab: N) => {
  activeTab.value = tab
  updateUrlParam(tab)
}

onMounted(() => {
  isLoading.value = true
  const params = new URLSearchParams(window.location.search)
  if (params.has(N.JSON)) {
    activeTab.value = N.JSON
  } else if (params.has(N.URL)) {
    activeTab.value = N.URL
  } else if (params.has(N.COMPARE)) {
    activeTab.value = N.COMPARE
  } else {
    activeTab.value = N.JSON
  }
  helper.sleep(700).then(() => {
    isLoading.value = false
  })
})
</script>

<template>
  <n-spin size="large" class="" tip="Loading..." :show="isLoading">
    <n-space vertical size="large" class="p-2 min-h-[93vh] bg-gray-100">
      <n-card title="Utilities" size="large" class="max-w-9xl mx-auto">
        <n-tabs
          type="line"
          animated
          v-model:value="activeTab"
          @update:value="handleTabChange"
        >
          <n-tab-pane :name="N.JSON" tab="JSON Formatter" />
          <n-tab-pane :name="N.URL" tab="URL Parser" />
          <n-tab-pane :name="N.COMPARE" tab="Text Compare" />
        </n-tabs>

        <div class="mt-4">
          <keep-alive>
            <component :is="currentComponent" />
          </keep-alive>
        </div>
      </n-card>
    </n-space>
  </n-spin>
</template>
<style scoped>
:deep(.n-spin-content.n-spin-content--spinning) {
  opacity: 0;
}
</style>
