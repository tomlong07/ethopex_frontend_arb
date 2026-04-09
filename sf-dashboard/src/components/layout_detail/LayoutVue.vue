<script setup lang="ts">
import LayoutDetail from '@/store/details/LayoutDetail'
const useLayoutDetail = LayoutDetail()

const openFileLayout = () => {
  window.open(
    `https://quicksavesearch.com/p/dental-implants-at-surprise-prices-smile-with-confidence-18585.webm?__xxx=preview_mode&testLayoutId=${useLayoutDetail.id}&adtest=on`,
    '_blank'
  )
}
const openFileSearch = () => {
  window.open(
    `https://quicksavesearch.com/search.webm?__xxx=preview_mode&testLayoutId=${useLayoutDetail.id}&_pubId=partner-pub-8153055892847290&query=dental&adtest=on`,
    '_blank'
  )
}

if (useLayoutDetail.isAddPage) {
  useLayoutDetail.layoutConfig.file_layout =
    `<template></template><script></` + `script>`
  useLayoutDetail.layoutConfig.file_layout =
    `<template></template><script></` + `script>`
}
</script>
<template>
  <div class="grid grid-cols-1 gap-2 w-full">
    <div class="flex flex-col gap-2">
      <div class="font-bold flex gap-4 items-center text-xs">
        File Layout
        <n-button
          size="small"
          @click="openFileLayout"
          v-if="useLayoutDetail.id != 0"
          >Preview</n-button
        >
      </div>
      <div
        class="w-full"
        :class="{
          'select-none opacity-50 pointer-events-none cursor-not-allowed':
            useLayoutDetail.isSubmitBtnLoading,
        }"
      >
        <useLayoutDetail.Codemirror
          class="code-editor-layout"
          v-model:value="useLayoutDetail.layoutConfig.file_layout"
          :options="useLayoutDetail.cmOptions"
          :border="true"
          height="600"
        ></useLayoutDetail.Codemirror>
      </div>
    </div>

    <n-divider />

    <div class="flex flex-col gap-2">
      <div class="font-bold flex gap-4 items-center text-xs">
        File Search
        <n-button
          size="small"
          v-if="useLayoutDetail.id != 0"
          @click="openFileSearch"
          >Preview</n-button
        >
      </div>
      <div
        class="w-full"
        :class="{
          'select-none opacity-50 pointer-events-none cursor-not-allowed':
            useLayoutDetail.isSubmitBtnLoading,
        }"
      >
        <useLayoutDetail.Codemirror
          class="code-editor-layout"
          v-model:value="useLayoutDetail.layoutConfig.file_search"
          :options="useLayoutDetail.cmOptions"
          :border="true"
          height="600"
        ></useLayoutDetail.Codemirror>
      </div>
    </div>
  </div>
</template>
