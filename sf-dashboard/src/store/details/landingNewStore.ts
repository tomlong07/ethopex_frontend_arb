import { ModeClassString } from '@/types/components/base'
import { defineStore } from 'pinia'
import { DS } from '@/enum/campaign'
import { L } from '@/enum/landing'

class LandingNewStore {
  prelanding: boolean = false
  fullStatus: boolean = false
  landingSpecial: boolean = false
  has_add: boolean = false

  landingLite?: boolean = false

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  validateThumb() {
    return !this.landingSpecial
  }
}

export type StepKey = L.BASIC | L.CONTENT
export interface StepItem {
  key: StepKey | string
  label: string
  showIf?: boolean
  children?: Array<{ key: string; label: string }>
}

export default defineStore('useLandingNew', () => {
  const permissions = ref<LandingNewStore>(new LandingNewStore())

  const setPermissions = (data: any) => {
    permissions.value = new LandingNewStore(data)
  }
  const modeData = helper.deepFreeze(
    new ModeClassString(window.route)
  ) as ModeClassString

  const isDuplicatePage = computed<boolean>(() => {
    return window.location.href.includes('?duplicate/')
  })
  const name = 'Landing Page'

  const convertName = computed(() => {
    return modeData.isAddPage()
      ? isDuplicatePage.value
        ? `Duplicate ${name}`
        : `Add ${name}`
      : `${name} Detail`
  })

  const steps = ref<StepItem[]>([
    {
      key: L.BASIC,
      label: convertName.value,
    },
    { key: L.CONTENT, label: 'Content' },
  ])

  watch(convertName, (v) => {
    if (steps.value?.length) {
      steps.value[0].label = v
    }
  })

  const currentStepIndex = ref<number>(0)
  const isStep = (key: StepKey | string) => currentStep.value?.key === key

  const setSteps = (newSteps: StepItem[], keepKey?: string) => {
    const prevKey = keepKey ?? currentStep.value?.key
    steps.value = newSteps
    const idx = steps.value.findIndex((s) => s.key === prevKey)
    currentStepIndex.value = idx >= 0 ? idx : 0
  }
  const currentStep = computed<StepItem | undefined>(
    () => steps.value[currentStepIndex.value]
  )

  const filterStepsByDS = (ds?: string | DS | null | undefined): StepItem[] => {
    return ds !== DS.ADSENSE
      ? steps.value.filter((s) => s.key === L.BASIC)
      : steps.value
  }

  const getVisibleNav = (ds?: string | DS | null | undefined) => {
    const list = filterStepsByDS(ds)
    const cur = currentStep.value
    const idxInVisible = cur ? list.findIndex((s) => s.key === cur.key) : -1

    const hasPrev = idxInVisible > 0
    const hasNext = idxInVisible >= 0 && idxInVisible < list.length - 1
    const prev = hasPrev ? list[idxInVisible - 1] : null
    const next = hasNext ? list[idxInVisible + 1] : null

    const toGlobalIndex = (item: StepItem | null) =>
      item ? steps.value.findIndex((s) => s.key === item.key) : -1

    return {
      list,
      idxInVisible,
      hasPrev,
      hasNext,
      prevGlobalIndex: toGlobalIndex(prev),
      nextGlobalIndex: toGlobalIndex(next),
    }
  }

  const canNavigate = (delta: -1 | 1, ds?: string | DS | null | undefined) => {
    const nav = getVisibleNav(ds)
    return delta === -1 ? nav.hasPrev : nav.hasNext
  }

  const navigate = (delta: -1 | 1, ds?: string | DS | null | undefined) => {
    const nav = getVisibleNav(ds)
    const target = delta === -1 ? nav.prevGlobalIndex : nav.nextGlobalIndex
    if (target >= 0) currentStepIndex.value = target
  }

  const isFirstVisible = (ds?: string | DS | null | undefined) =>
    !canNavigate(-1, ds)
  const isLastVisible = (ds?: string | DS | null | undefined) =>
    !canNavigate(1, ds)

  const goToStep = (i: number) => {
    if (i >= 0 && i < steps.value.length) currentStepIndex.value = i
  }

  return {
    permissions,
    setPermissions,

    // menu landing
    steps,
    currentStep,
    currentStepIndex,

    setSteps,
    isStep,
    goToStep,

    canNavigate,
    navigate,
    isFirstVisible,
    isLastVisible,
  }
})
