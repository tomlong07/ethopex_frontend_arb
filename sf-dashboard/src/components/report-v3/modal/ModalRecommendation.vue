<script setup lang="ts">
import CKEditor from '@/components/common/CKEditor.vue'
import { useCkeditorLoader } from '@/composables/useCkeditorLoader'
import { useRecommendation } from '@/store/campaignRecommendation'

const rcmStore = useRecommendation()
const noteDataEditorRef = ref<InstanceType<typeof CKEditor>>()
const { loadCkeditorScript, initEditor } = useCkeditorLoader()

const initialNoteValue = ref<string>('')

const titleNow = computed(() => {
  switch (true) {
    case rcmStore.isCPA:
      return 'Adjust your CPA targets'
    case rcmStore.isROAS:
      return 'Bid more efficiently with Target ROAS'
    case rcmStore.isBudget:
      return 'Adjust your budgets'
  }

  return 'Recommendation'
})

const textNow = computed(() => {
  switch (true) {
    case rcmStore.isCPA:
      return 'Select a new average target CPA'
    case rcmStore.isROAS:
      return 'Set a target ROAS'
    case rcmStore.isBudget:
      return 'Select a new daily budget'
  }

  return ''
})

const heightNow = computed(() => {
  return rcmStore.isROAS ? 600 : 800
})

const widthNow = computed(() => {
  return rcmStore.isROAS ? 900 : 1300
})

const onChangeNoteDataEditor = (data: string) => {
  rcmStore.noteRecommendation = data
}

const loadNoteDataEditor = async () => {
  try {
    await loadCkeditorScript()
    initEditor(noteDataEditorRef)
  } catch (error) {
    console.error('CKEditor load failed', error)
  }
}

const resetNoteIfClosed = () => {
  if (!rcmStore.showModal) {
    rcmStore.noteRecommendation = initialNoteValue.value
    if (noteDataEditorRef.value) {
      noteDataEditorRef.value.setData(initialNoteValue.value)
    }
  }
}

watch(
  () => rcmStore.showModal,
  (newVal, oldVal) => {
    if (newVal) {
      initialNoteValue.value = rcmStore.noteRecommendation
      loadNoteDataEditor()
    } else if (oldVal === true && newVal === false) {
      resetNoteIfClosed()
    }
  }
)
</script>

<template>
  <n-modal v-model:show="rcmStore.showModal">
    <n-card
      :style="{ height: heightNow + 'px', width: widthNow + 'px' }"
      size="huge"
      :title="titleNow"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <n-card
        class="flex-gap-4 overflow-y-auto"
        :style="{ height: heightNow - 180 + 'px' }"
      >
        <div class="flex flex-col gap-4 h-full">
          {{ textNow }}

          <!-- Main content based on type -->
          <RecomendationCPA v-if="rcmStore.isCPA" />

          <div v-if="rcmStore.isROAS">
            <n-input-number
              min="0"
              max="100000"
              v-model:value="rcmStore.dataRef"
            >
              <template #suffix> % </template>
            </n-input-number>
          </div>

          <RecomendationBudget v-if="rcmStore.isBudget" />

          <div class="flex items-center gap-2 mt-4">
            <div class="w-16 font-bold">Note</div>
            <div class="flex-1 min-w-0">
              <CKEditor
                id="noteDataEditor"
                ref="noteDataEditorRef"
                :initData="rcmStore.noteRecommendation"
                :autoInit="false"
                @changeEditor="onChangeNoteDataEditor"
                title="Note Data"
                :isOpenTool="false"
                :onlyColorToolbar="true"
              />
            </div>
          </div>
        </div>
      </n-card>

      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="button-apply"
            color="#f43f5e"
            :loading="rcmStore.isSubmitting"
            @click="rcmStore.submitForm"
          >
            Apply
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
