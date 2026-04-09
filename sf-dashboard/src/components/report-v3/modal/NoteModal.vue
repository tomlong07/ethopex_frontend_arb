<script setup lang="ts">
import { useCkeditorLoader } from '@/composables/useCkeditorLoader'
import useReportNotes from '@/store/report/report-v2-modal-note'
import { addTargetBlankToLinks } from '@/utils/utils'

const CKEditor = defineAsyncComponent(
  () => import('@/components/common/CKEditor.vue')
)

// !! State
const noteStore = useReportNotes()
const { loadCkeditorScript, initEditor } = useCkeditorLoader()
const noteEditorRef = ref<InstanceType<typeof CKEditor>>()

// !! Func
const onChangeNoteEditor = (content: string) => {
  noteStore.note = addTargetBlankToLinks(content)
}

const loadNoteDataEditor = async () => {
  try {
    await loadCkeditorScript()
    initEditor(noteEditorRef)
  } catch (error) {
    console.error('CKEditor load failed', error)
  }
}

// !! Lifecycle hook
watch(
  () => noteStore.showModal,
  (newVal) => {
    if (newVal) {
      loadNoteDataEditor()
    }
  },
  { immediate: true }
)
</script>

<template>
  <n-modal v-model:show="noteStore.showModal">
    <n-card
      :style="{ height: '600px', width: '800px' }"
      size="huge"
      title="Note"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <n-card class="flex-gap-4 overflow-y-auto">
        <!-- <n-input type="textarea" v-model:value="noteStore.note" /> -->
        <CKEditor
          id="noteEditor"
          ref="noteEditorRef"
          :initData="noteStore.note"
          :autoInit="false"
          @changeEditor="onChangeNoteEditor"
          title="Note Data"
          :isOpenTool="false"
          :onlyColorToolbar="true"
        />
      </n-card>

      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="button-apply"
            color="#f43f5e"
            :loading="noteStore.isSubmitting"
            @click="noteStore.submitForm()"
          >
            Save
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
