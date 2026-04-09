import { DC } from '@/enum/domain_config'
import { ModeClassString } from '@/types/components/base'
import { defineStore } from 'pinia'

export type StepKey = DC.DOMAIN_CONFIG | DC.CAMPAIGNS_USED | DC.LOGS

export interface StepItem {
  key: StepKey | string
  label: string
}

export default defineStore('useDomainConfigNav', () => {
  // Không freeze để có thể reactive khi route thay đổi
  const modeData = reactive(new ModeClassString(window.route))

  const currentStepIndex = ref<number>(0)
  const _initializing = ref<boolean>(true)

  const name = 'Domain Config'

  const convertName = computed(() => {
    return modeData.isAddPage() ? `Add ${name}` : `${name} Detail`
  })

  const steps = ref<StepItem[]>([
    {
      key: DC.DOMAIN_CONFIG,
      label: convertName.value,
    },
    {
      key: DC.CAMPAIGNS_USED,
      label: 'Campaigns Used',
    },
    {
      key: DC.LOGS,
      label: 'Logs',
    },
  ])

  watch(convertName, (v) => {
    if (steps.value?.length) {
      steps.value[0].label = v
    }
  })

  const isStep = (key: StepKey | string) => currentStep.value?.key === key

  // Lọc steps theo mode (Add page chỉ có DOMAIN_CONFIG)
  const visibleSteps = computed<StepItem[]>(() => {
    if (modeData.isAddPage()) {
      return steps.value.filter((s) => s.key === DC.DOMAIN_CONFIG)
    }
    return steps.value
  })

  const currentStep = computed<StepItem | undefined>(
    () => visibleSteps.value[currentStepIndex.value]
  )

  // Khởi tạo tab từ URL query
  const initTabFromUrl = () => {
    const tabFromUrl = window.route.query.tab as string
    if (tabFromUrl) {
      // Tìm trong visibleSteps thay vì steps
      const idx = visibleSteps.value.findIndex((s) => s.key === tabFromUrl)
      if (idx >= 0) {
        currentStepIndex.value = idx
      }
    }
  }

  // Cập nhật URL khi đổi menu
  const updateUrlQuery = (tabKey: string) => {
    const currentQuery = window.route.query
    if (currentQuery.tab !== tabKey) {
      window.router.replace({
        query: {
          ...currentQuery,
          tab: tabKey,
        },
      })
    }
  }

  // Watch route changes để cập nhật modeData
  watch(
    () => window.route.params.id,
    () => {
      // Begin initialization to avoid intermediate URL updates
      _initializing.value = true
      Object.assign(modeData, new ModeClassString(window.route))
      // Reset index, then apply query (if any) after computed visibleSteps update
      currentStepIndex.value = 0
      nextTick(() => {
        const tabFromUrl = window.route.query.tab as string | undefined
        const valid = tabFromUrl
          ? visibleSteps.value.some((s) => s.key === tabFromUrl)
          : false
        if (!tabFromUrl || !valid) {
          if (visibleSteps.value[0]) {
            // set index then update url
            currentStepIndex.value = 0
            updateUrlQuery(visibleSteps.value[0].key)
          }
        } else {
          // Nếu query.tab hợp lệ, áp dụng nó (đảm bảo index khớp)
          const idx = visibleSteps.value.findIndex((s) => s.key === tabFromUrl)
          if (idx >= 0) currentStepIndex.value = idx
        }
        // finished initialization
        _initializing.value = false
      })
    }
  )

  // Watch currentStepIndex để cập nhật URL (bỏ qua khi đang khởi tạo)
  watch(currentStepIndex, (newIndex) => {
    if (_initializing.value) return
    const step = visibleSteps.value[newIndex]
    if (step) {
      updateUrlQuery(step.key)
    }
  })

  const canNavigate = (delta: -1 | 1) => {
    const nextIndex = currentStepIndex.value + delta
    return nextIndex >= 0 && nextIndex < visibleSteps.value.length
  }

  const navigate = (delta: -1 | 1) => {
    if (canNavigate(delta)) {
      currentStepIndex.value += delta
    }
  }

  const isFirstStep = computed(() => currentStepIndex.value === 0)

  const isLastStep = computed(
    () => currentStepIndex.value === visibleSteps.value.length - 1
  )

  const goToStep = (i: number) => {
    if (i >= 0 && i < visibleSteps.value.length) {
      currentStepIndex.value = i
    }
  }

  // Khởi tạo từ URL khi load store lần đầu
  nextTick(() => {
    initTabFromUrl()
    _initializing.value = false
  })

  return {
    steps,
    visibleSteps,
    currentStep,
    currentStepIndex,
    isStep,
    goToStep,
    canNavigate,
    navigate,
    isFirstStep,
    isLastStep,
    modeData,
  }
})
