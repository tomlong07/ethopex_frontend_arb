<template>
  <n-popconfirm
    :show-icon="false"
    :negative-text="null"
    positive-text="Generate"
    @positive-click="handlePositiveClick"
  >
    <template #trigger>
      <n-button>Generate Keywords</n-button>
    </template>
    <div class="w-[32rem]">
      <n-input v-model:value="landingPage" :max="1000"></n-input>
    </div>
  </n-popconfirm>
</template>
<script setup lang="ts">
import { ctr_landing_page } from '@/services/ctr_landing_page'
import { useKeywordSetStore } from '@/store/details/kwsetStore'
const kwsetStore = useKeywordSetStore()
const landingPage = ref<string>('')

const handlePositiveClick = async () => {
  if (!landingPage.value) return

  if (!helper.isValidURL(landingPage.value)) {
    window.message.warning('Please enter a valid URL')
    return
  }
  kwsetStore.isGenerating = true

  const result = await ctr_landing_page.GetKeywordsByLandingPage({
    url: landingPage.value,
  })

  try {
    if (result?.data?.error) {
      window.message.error(result?.data?.error)
      return
    }

    if (result?.data?.keywords === '') {
      window.message.warning('No keywords found')
      return
    }
    const keywords = result?.data?.keywords || ''
    const kwArr = helper.stringToArray(keywords)

    if (kwsetStore.dataConfig.keyword_ab_test) {
      kwsetStore.dataConfig.keywords = []

      kwArr.forEach((kw: string) => {
        kwsetStore.dataConfig.keywords?.push({
          keyword: kw,
          status: 'on',
        })
      })
    }
  } finally {
    kwsetStore.isGenerating = false
  }
}
</script>
