<script setup lang="ts">
import { useCkeditorLoader } from '@/composables/useCkeditorLoader'

import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'
import CKEditor from '@/components/common/CKEditor.vue'
const { loadCkeditorScript, initEditor } = useCkeditorLoader()

const categorySiteStore = useCategorySite()
const { categorySite } = storeToRefs(categorySiteStore)
const descriptionEditorRef = ref<InstanceType<typeof CKEditor>>()

watch(
  () => categorySiteStore.isLoadingPage,
  (newVal, oldValue) => {
    if (!newVal && oldValue) {
      loadCkeditorScript()
      initEditor(descriptionEditorRef)
    }
  }
)

onMounted(() => {
  if (categorySiteStore.isAddPage) {
    loadCkeditorScript()
    initEditor(descriptionEditorRef)
  }
})

const onChangedescriptionEditor = (content: string) => {
  categorySite.value.description = content
}
</script>

<template>
  <div
    class="flex-column items-center space-y-1"
    v-if="!categorySiteStore.isLoadingPage"
  >
    <div class="font-medium text-xs text-gray-400">Description</div>
    <div>
      <CKEditor
        id="descriptionEditor"
        ref="descriptionEditorRef"
        :initData="categorySite.description"
        :autoInit="false"
        @changeEditor="onChangedescriptionEditor"
        title="Description"
        :isOpenTool="false"
      />
    </div>
  </div>
</template>
