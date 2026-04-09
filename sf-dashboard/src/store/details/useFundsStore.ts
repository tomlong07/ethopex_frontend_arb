import { defineStore } from 'pinia'
import { FormRules } from 'naive-ui'
import { SelectOption } from 'naive-ui'
import { fundsData } from '@/types/components/funds'
import { ctr_funds } from '@/services/ctr_funds'

export class FundPermissions {
  showPublisher?: boolean

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue
          this[key as keyof this] = element
        }
      }
    }
  }
}

export default defineStore('useFundsStore', () => {
  const isLoading = ref<boolean>(false)
  const amount = ref()
  const optionSource = ref<[]>()

  const fundPermission = ref(new FundPermissions())

  const dataFundsConfig = {
    amount: 0,
    source: [],
    note: '',
  }
  const statusOptions = ref<SelectOption[]>([
    { label: 'Pending', value: 'pending', disabled: false },
    { label: 'Success', value: 'success', disabled: false },
    { label: 'Rejected', value: 'rejected', disabled: false },
  ])
  const rules: FormRules = {
    source: {
      required: true,
      trigger: ['blur', 'change'],
      message: 'Please select source',
    },
    amount: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: 'Please enter amount',
    },
    status: {
      required: true,
      trigger: ['blur', 'change'],
      message: 'Please select status',
    },
  }
  const infomationError = ref<any>({})
  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []

    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)  
  })

  const fetchFundSource = async (id?: any) => {
    const result = await ctr_funds.GetSource(id)
    const option = result.data.map((item: any) => ({
      value: item.value,
      label: item.name,
    }))
    optionSource.value = option
  }

  const isDisabled = computed<boolean>(() => {
    return window.router.currentRoute.value.params.id ? true : false
  })

  const fundsConfig = ref<fundsData>({
    ...dataFundsConfig,
  })
  const clearData = () => {
    fundsConfig.value = { ...dataFundsConfig }
  }
  const clearOptionSource = () => {
    optionSource.value = undefined
  }

  const setPermissions = (data: any) => {
    fundPermission.value = new FundPermissions(data)
  }
  return {
    fundsConfig,
    statusOptions,
    rules,
    fundPermission,
    isDisabled,
    isLoading,
    amount,
    clearData,
    fetchFundSource,
    optionSource,
    clearOptionSource,
    setPermissions,
    infomationError,
    showErr,
  }
})
