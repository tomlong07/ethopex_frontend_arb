import { ctr_account } from '@/services/ctr_account'
import {
  Answer,
  QuestionManagementAds,
} from '@/types/state/question_management_ads'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

export default defineStore('useQuestionManagementAds', () => {
  const isSubmitBtnLoading = ref<boolean>(false)
  const isShowPlusMins = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const isAllSelected = ref<boolean>(false)
  const isMccLoading = ref<boolean>(false)
  const isShowModalMcc = ref<boolean>(false)
  const name = ref('Google Appeal Question')
  const mccOptions = ref<SelectOption[]>([])

  const getDefaultData = (): QuestionManagementAds => ({
    id: undefined,
    name: '',
    question: '',
    type: null,
    type_input: null,
    status: 'on',
    apply_mcc: [],
    note: '',
    answers: [{ id: 0, status: 'on', answer: '', by: '' }],
  })

  const QuestionConfig = ref<QuestionManagementAds>(getDefaultData())

  const clearData = () => {
    QuestionConfig.value = getDefaultData()
  }
  const convertAnswerToAnswers = (answers: Answer[] | null) => {
    QuestionConfig.value.answers =
      answers && answers.length > 0
        ? answers
        : [{ id: 0, status: 'on', answer: '', by: '' }]
  }
  const setData = (data: QuestionManagementAds) => {
    QuestionConfig.value = { ...getDefaultData(), ...data }
    convertAnswerToAnswers(data.answers)
  }

  //lưu vào mccOptions
  const fetchMCCOptions = async (query: string = '') => {
    isMccLoading.value = true
    try {
      const res = await ctr_account.GetAllMCC(query)
      if (res?.status && res.data) {
        // Loại bỏ trùng lặp account mcc
        const uniqueMccs = Array.from(
          new Set(res.data.map((mcc: { id: string }) => mcc.id))
        )
          .map((id) => res.data.find((mcc: { id: string }) => mcc.id === id))
          .filter((mcc): mcc is { id: string; name: string } => !!mcc)
        mccOptions.value = [
          { label: 'ALL', value: 'ALL' },
          ...uniqueMccs.map((mcc) => ({
            label: mcc.name,
            value: mcc.id,
          })),
        ]
      }
    } catch (error) {
      console.error('Failed to fetch MCC options:', error)
    } finally {
      isMccLoading.value = false
    }
  }

  return {
    clearData,
    setData,
    convertAnswerToAnswers,
    fetchMCCOptions,
    isSubmitBtnLoading,
    QuestionConfig,
    isLoading,
    name,
    mccOptions,
    isShowPlusMins,
    isMccLoading,
    isAllSelected,
    isShowModalMcc,
  }
})
