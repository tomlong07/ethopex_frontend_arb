<script setup lang="ts">
import ctr_api_document from '@/services/ctr_api_document'
import useGeneralStore from '@/store/useGeneralStore'

const generalStore = useGeneralStore()
const htmlContent = ref('')
const isLoading = ref<boolean>(false)

const getData = async () => {
  try {
    isLoading.value = true
    const res: any = await ctr_api_document.GetDataDocumentApi()
    let html = res?.data?.html || ''
    if (html && !html.includes('<base')) {
      if (html.includes('<head>')) {
        html = html.replace('<head>', '<head><base href="about:srcdoc">')
      } else {
        html = `<base href="about:srcdoc">${html}`
      }
    }
    htmlContent.value = html
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getData()
})

const goHome = () => {
  window.location.href = generalStore.homePage
}
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-white">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-white"
    >
      <n-spin size="large" />
    </div>
    <button
      v-if="!isLoading && generalStore.homePage"
      class="!fixed !top-5 !right-5 !z-[9999] px-4 py-2 bg-[#dc3545] text-white rounded cursor-pointer text-sm font-medium transition-colors hover:bg-[#c82333] active:bg-[#a71d2a]"
      @click="goHome"
    >
      ← Back
    </button>
    <iframe
      v-if="htmlContent && !isLoading"
      class="w-full h-full"
      :srcdoc="htmlContent"
      sandbox="allow-scripts  allow-popups allow-modals"
    />
  </div>
</template>
