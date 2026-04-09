import { ctr_account } from '@/services/ctr_account'
import { ctr_adsense_style } from '@/services/ctr_adsense_style'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

export interface StyleExperimentData {
  adsenseAccount?: string
  updateStyles?: string[]
  generation?: string | null
}

export const useStyleExperimentStore = defineStore(
  'styleExperimentStore',
  () => {
    // State
    const version = '1.0'
    const name = `Style Experiments`

    const isLoading = ref(true)
    const isLoadingAccount = ref(true)
    const showModal = ref(false)

    const dataConfig = ref<StyleExperimentData>({})

    const adsenseAccountOptions = ref<SelectOption[]>([])
    const generationSelectOptions = ref<SelectOption[]>([])
    const styleOptions = ref<SelectOption[]>([])

    const modalIds = ref<string>('')

    const getAdsenseAccounts = async () => {
      isLoadingAccount.value = true
      const result = await ctr_account.GetByChannelStatus()

      adsenseAccountOptions.value = result.data || []

      isLoadingAccount.value = false
    }

    const getStyleOptions = async () => {
      const result = await ctr_adsense_style.GetStyleByPubID(
        dataConfig.value.adsenseAccount,
        {
          generation: dataConfig.value.generation,
        }
      )

      styleOptions.value = []
      ;(result?.data || []).forEach((element: any) => {
        styleOptions.value.push({
          label: element.name,
          value: element.style_id,
        })

        dataConfig.value.updateStyles?.push(element.style_id)
      })
    }

    const getGenerationByAdsense = async () => {
      const result = await ctr_adsense_style.GetGenerationOfStyleByPubID(
        dataConfig.value.adsenseAccount
      )
      generationSelectOptions.value = []
      ;(result?.data || []).forEach(
        (element: { generation: string; is_used: boolean }) => {
          generationSelectOptions.value.push({
            value: element.generation,
            label: element.generation,
            disabled: !element.is_used, // Disable option nếu is_used = false
            //Nó đang chạy Gen 1 thì phải chọn Gen 1 vì Gen 1 mới có traffic thì mới A/B test đc chứ
          })
        }
      )
    }

    return {
      // State
      version,
      name,
      isLoading,
      isLoadingAccount,
      dataConfig,
      adsenseAccountOptions,
      generationSelectOptions,
      styleOptions,
      showModal,
      modalIds,

      getAdsenseAccounts,
      getStyleOptions,
      getGenerationByAdsense,
    }
  }
)
