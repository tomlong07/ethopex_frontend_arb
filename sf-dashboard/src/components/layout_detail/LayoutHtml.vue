<script setup lang="ts">
import LayoutDetail from '@/store/details/LayoutDetail'
const useLayoutDetail = LayoutDetail()

const isOnContent = computed<boolean>(() => {
  return (
    useLayoutDetail.layoutConfig.type == 'content' ||
    useLayoutDetail.layoutConfig.type == 'search'
  )
})
const openLayoutContent = () => {
  // window.open(
  //   `https://quicksavesearch.com/layout_preview/landing?__xxx=preview_mode&testLayoutId=${useLayoutDetail.id}&adtest=on&_ckttl=d8433836-62c5-45a4-99d4-388573303b4e&_pubId=partner-pub-8153055892847290&adtest=on`,
  //   '_blank'
  // );

  window.open(
    `https://quicksavesearch.com/prv/become-an-egg-donor-a-lifechanging-opportunity-with-generous-compensation-in-the-us-18864.webm?__xxx=preview_mode&testLayoutId=${useLayoutDetail.id}&adtest=on&_ckttl=c59838e5-95ad-4d1d-afcc-7438182d4f8c&_pubId=partner-pub-8153055892847290`,
    '_blank'
  )
}

const openLayoutSearch = () => {
  window.open(
    `https://quicksavesearch.com/layout_preview/search?__xxx=preview_mode&testLayoutId=${useLayoutDetail.id}&adtest=on&_ckttl=0a688ddb-f2be-4dbd-90e6-c831383e9253&_pubId=partner-pub-8153055892847290&query=Dental+Implants&page=1`,
    '_blank'
  )
}
</script>
<template>
  <div class="grid grid-cols-1 gap-2 w-full">
    <div class="grow">
      <n-form-item path="content">
        <template #label>
          <div class="font-bold flex items-center gap-2">
            <div
              class="text-xs"
              title="It available with types: Content, Search."
            >
              Layout Content
            </div>

            <n-button
              size="small"
              @click="openLayoutContent"
              v-if="useLayoutDetail.id != 0"
              >Preview</n-button
            >
          </div>
        </template>
        <div
          class="w-full"
          :class="{
            'select-none opacity-50 pointer-events-none cursor-not-allowed':
              useLayoutDetail.isSubmitBtnLoading || !isOnContent,
          }"
        >
          <useLayoutDetail.Codemirror
            class="code-editor-layout"
            v-model:value="useLayoutDetail.layoutConfig.content"
            :options="useLayoutDetail.cmOptions"
            :border="true"
            height="600"
          >
          </useLayoutDetail.Codemirror>
        </div>
      </n-form-item>
    </div>
    <!-- <div class="grow">
      <n-form-item path="search">
        <template #label>
          <div class="flex items-center gap-2 font-bold">
            <div class="text-xs" title="It available with types: Search, Search to Search.">
              Layout Search
            </div>
            <n-button
              size="small"
              @click="openLayoutSearch"
              v-if="useLayoutDetail.id != 0"
              >Preview</n-button
            >
          </div>
        </template>

        <div
          class="w-full"
          :class="{
            'select-none opacity-50 pointer-events-none cursor-not-allowed':
              useLayoutDetail.isSubmitBtnLoading || !useLayoutDetail.isOnSearch,
          }"
        >
          <useLayoutDetail.Codemirror
            class="code-editor-layout"
            v-model:value="useLayoutDetail.layoutConfig.search"
            :options="useLayoutDetail.cmOptions"
            :border="true"
            height="600"
          >
          </useLayoutDetail.Codemirror>
        </div>
      </n-form-item>
    </div> -->
  </div>
</template>
