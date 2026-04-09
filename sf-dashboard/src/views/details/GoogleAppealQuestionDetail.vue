<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import { ModeClass } from '@/types/components/base'
import QuestionMAds from '@/store/useQuestionManagementAds'
import { ctr_question_management_ads } from '@/services/ctr_question_management_ads'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import QuestionName from '@/components/question_management_ads/QuestionName.vue'
import QuestionStatus from '@/components/question_management_ads/QuestionStatus.vue'
import QuestionType from '@/components/question_management_ads/QuestionType.vue'
import QuestionTypeInput from '@/components/question_management_ads/QuestionTypeInput.vue'
import QuestionApplyMCC from '@/components/question_management_ads/QuestionApplyMCC.vue'
import QuestionAnswersByManual from '@/components/question_management_ads/QuestionAnswersByManual.vue'
import QuestionAnswersByAI from '@/components/question_management_ads/QuestionAnswersByAI.vue'
import QuestionNote from '@/components/question_management_ads/QuestionNote.vue'
import SkeletonDetailCenter from '@/components/skeleton/SkeletonDetailCenter.vue'
import QuestionAds from '@/components/question_management_ads/QuestionAds.vue'

const useQuestionManagementAds = QuestionMAds()
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const modeData = helper.deepFreeze(new ModeClass(window.route)) as ModeClass

if (modeData.isAddPage()) {
  useQuestionManagementAds.clearData()
  useQuestionManagementAds.QuestionConfig.answers = [
    { id: 0, status: 'on', answer: '', by: '' },
  ]
}

const reLoadData = async () => {
  return await ctr_question_management_ads.GetByID(modeData.id)
}
const submitForm = async () => {
  const validAnswers = useQuestionManagementAds.QuestionConfig.answers.filter(
    (ans) => ans.answer.trim() !== ''
  )
  useQuestionManagementAds.isSubmitBtnLoading = true

  try {
    const payload = {
      ...useQuestionManagementAds.QuestionConfig,
      answers: validAnswers,
    }
    // return
    const isAddMode = modeData.isAddPage()
    const apiCall = isAddMode
      ? ctr_question_management_ads.Add(payload)
      : ctr_question_management_ads.Update(payload)

    const result = await apiCall
    if (result?.status) {
      window.message.success(isAddMode ? 'Submit success!' : 'Update success!')
      const res = await reLoadData()
      useQuestionManagementAds.setData(res.data)
      ensureAtLeastOneAnswer('ai')
      ensureAtLeastOneAnswer('manual')
      if (isAddMode) {
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      }
    }
  } finally {
    useQuestionManagementAds.isSubmitBtnLoading = false
  }
}
const ensureAtLeastOneAnswer = (by: 'ai' | 'manual') => {
  const current = useQuestionManagementAds.QuestionConfig.answers.filter(
    (a) => a.by === by
  )
  if (current.length === 0) {
    useQuestionManagementAds.QuestionConfig.answers.push({
      id: 0,
      status: 'on',
      answer: '',
      by,
    })
  }
}

onMounted(async () => {
  useQuestionManagementAds.isLoading = true
  ensureAtLeastOneAnswer('ai')
  ensureAtLeastOneAnswer('manual')
  await useQuestionManagementAds.fetchMCCOptions() //GetAllMCC
  if (modeData.isEditPage() && modeData.id) {
    const res = await reLoadData()
    if (res?.status && res.data) {
      useQuestionManagementAds.setData(res.data)
      if (
        useQuestionManagementAds.QuestionConfig.answers.filter(
          (a) => a.by === 'ai'
        ).length == 0
      ) {
        useQuestionManagementAds.isShowPlusMins = true
      }
      ensureAtLeastOneAnswer('ai')
      ensureAtLeastOneAnswer('manual')
      if (res.data.apply_mcc.includes('ALL')) {
        useQuestionManagementAds.mccOptions.forEach((opt) => {
          opt.disabled = opt.value !== 'ALL'
        })
        useQuestionManagementAds.QuestionConfig.apply_mcc = ['ALL']
        useQuestionManagementAds.isAllSelected = true
      } else {
        useQuestionManagementAds.mccOptions.forEach((opt) => {
          opt.disabled = false
        })
        useQuestionManagementAds.isAllSelected =
          res.data.apply_mcc.length ===
          useQuestionManagementAds.mccOptions.length - 1
      }
    }
  }
  useQuestionManagementAds.isLoading = false
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center items-start">
      <div class="grid gap-4 grid-cols-1 p-5 w-full max-w-4xl">
        <BackPage
          :url="feSettings?.page_list"
          :name="useQuestionManagementAds.name"
          v-if="feSettings?.page_list"
        />
        <SkeletonDetailCenter v-if="useQuestionManagementAds.isLoading" />
        <n-card title="Question" class="card-flex-gap-4" v-else>
          <n-grid x-gap="14" y-gap="14" cols="1">
            <n-gi class="flex flex-col gap-4">
              <n-card class="card-flex-gap-4">
                <QuestionName />
                <QuestionStatus />
                <QuestionType />
                <QuestionTypeInput />
                <QuestionApplyMCC />
                <QuestionAds />
                <n-divider />
                <QuestionAnswersByManual />
                <n-divider />
                <QuestionAnswersByAI />
                <n-divider />
                <QuestionNote />
              </n-card>
            </n-gi>
          </n-grid>
        </n-card>
        <div class="flex flex-row-reverse sticky bottom-0 p-2">
          <div class="flex items-center gap-4">
            <n-button
              color="#f43f5e"
              size="medium"
              type="success"
              :disabled="useQuestionManagementAds.isLoading"
              :loading="useQuestionManagementAds.isSubmitBtnLoading"
              @click="submitForm"
            >
              Submit
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
