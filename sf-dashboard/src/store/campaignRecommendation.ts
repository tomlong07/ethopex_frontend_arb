import { ctr_campaign } from '@/services/ctr_campaign'
import { defineStore } from 'pinia'

export interface BudgetOption {
  budgetAmountMicros: number
  impact: ImpactOption
}

interface ImpactOption {
  baseMetrics: MetricOption
  potentialMetrics: MetricOption
}

interface MetricOption {
  impressions: number
  clicks: number
  conversions: number
  costMicros: string
}

interface BudgetData {
  budgetOptions: BudgetOption[]
  currentBudgetAmountMicros: number
  recommendedBudgetAmountMicros: number
}

interface CPAData {
  impact: ImpactOption
  raiseTargetCpaRecommendation: RaiseData
}

interface RaiseData {
  targetAdjustment: TargetData
}

interface TargetData {
  recommendedTargetMultiplier: number
  currentAverageTargetMicros: string
}

// ts-prune-ignore-next
export const useRecommendation = defineStore('useRecommendation', () => {
  const showModal = ref(false)
  const isSubmitting = ref(false)
  const typeModal = ref('')
  const campaignId = ref(0)

  const dataRawBudget = ref<BudgetData | null>()
  const dataRawCPA = ref<CPAData | null>()
  const recommendCPA = ref(0)

  const isCustomBudget = ref(false)
  const isCustomCPA = ref(false)
  const dataRef = ref<number>(0)

  const isCPA = computed(() => {
    return typeModal.value === 'cpa'
  })

  const isROAS = computed(() => {
    return typeModal.value === 'roas'
  })

  const isBudget = computed(() => {
    return typeModal.value === 'budget'
  })

  const fieldNow = computed(() => {
    if (isCPA.value || isROAS.value) {
      return 'cpc'
    }

    if (isBudget.value) {
      return 'budget'
    }
    return ''
  })

  const budgetOptionsShow = computed(() => {
    return dataRawBudget.value?.budgetOptions?.filter((item) => {
      return (
        item.budgetAmountMicros !==
        dataRawBudget.value?.currentBudgetAmountMicros
      )
    })
  })

  const isChooseRcmBudget = computed(() => {
    return (
      isBudget.value &&
      dataRawBudget.value &&
      dataRef.value === dataRawBudget.value?.recommendedBudgetAmountMicros / 1e6
    )
  })
  const noteRecommendation = ref<string>('')
  const payload = computed(() => {
    let pl = [
      {
        campaign_id: campaignId.value,
        field: fieldNow.value,
        note: noteRecommendation.value,
        value: String(dataRef.value),
      },
    ]

    switch (true) {
      case isCPA.value:
        pl.push({
          campaign_id: campaignId.value,
          note: noteRecommendation.value,
          field: 'bidding',
          value: 'maximizeConversions',
        })
        break

      case isROAS.value:
        pl.push({
          campaign_id: campaignId.value,
          note: noteRecommendation.value,
          field: 'bidding',
          value: 'maximizeConversionValue',
        })
        break
    }

    return pl
  })

  const submitForm = async () => {
    isSubmitting.value = true
    try {
      if (!fieldNow.value) return

      const result = await ctr_campaign.UpdateField(payload.value)

      if (result?.status) {
        window.message.success('Success')
        showModal.value = false
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      isSubmitting.value = false
    }
  }

  const changeDataRef = (obj: any) => {
    switch (true) {
      case isBudget.value:
        try {
          dataRawBudget.value = JSON.parse(obj.recommend_budget)

          dataRef.value = dataRawBudget.value?.recommendedBudgetAmountMicros
            ? parseFloat(
                (
                  dataRawBudget.value?.recommendedBudgetAmountMicros / 1e6
                ).toFixed(2)
              )
            : 0
        } catch (error) {
          console.error(error)

          dataRawBudget.value = null
          dataRef.value = 0
        }

        break
      case isCPA.value:
        try {
          dataRawCPA.value = JSON.parse(obj.recommend_cpa)
          setRecommendationCPA()
          recommendCPA.value = dataRef.value
        } catch {
          dataRawCPA.value = null
        }
        break
      case isROAS.value:
        dataRef.value = Math.round(obj.recommend_roas * 10000) / 100
        break
    }
  }

  const setRecommendationCPA = () => {
    dataRef.value = parseFloat(
      (
        (Number(
          dataRawCPA.value?.raiseTargetCpaRecommendation?.targetAdjustment
            ?.recommendedTargetMultiplier
        ) *
          Number(
            dataRawCPA.value?.raiseTargetCpaRecommendation.targetAdjustment
              .currentAverageTargetMicros
          )) /
        1e6
      ).toFixed(2)
    )
    isCustomCPA.value = false
  }

  const changeDataRefDirect = (value: number) => {
    dataRef.value = value
    isCustomBudget.value = false
  }

  return {
    showModal,
    campaignId,
    isSubmitting,
    typeModal,
    dataRef,
    dataRawBudget,
    dataRawCPA,
    isCustomBudget,
    isCustomCPA,
    recommendCPA,
    noteRecommendation,

    isCPA,
    isROAS,
    isBudget,
    isChooseRcmBudget,
    budgetOptionsShow,

    changeDataRef,
    changeDataRefDirect,
    submitForm,
    setRecommendationCPA,
  }
})
