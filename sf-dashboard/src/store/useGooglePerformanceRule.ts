import {
  GooglePerformanceRule,
  ConfigData,
  ConditionOption,
  ConditionType,
  OperatorOptions,
  ConditionConfig,
  SatisfyResponse,
  SatisfyRulePayload,
  Condition,
  LogicOperator,
} from '@/types/state/google_performance_rule'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import { useTemplateV2 } from './templateV2Store'
import { ctr_google_performance_rule } from '@/services/ctr_google_performance_rule'

export default defineStore('useGooglePerformanceRule', () => {
  const name = ref('Google Performance Rule')
  const isLoading = ref(false)
  const isLoadingSkeleton = ref(false)
  const mccOptions = ref<SelectOption[]>([])
  const configData = ref<ConfigData | null>(null)
  const conditionOptions = ref<ConditionOption[]>([])
  const QuestionConfig = ref<GooglePerformanceRule>()
  const showSatisfyModal = ref(false)
  const currentRuleId = ref<number | null>(null)
  const statusRuleId = ref('')
  const satisfyData = ref<SatisfyResponse | null>(null)
  const isSatisfyLoading = ref(false)
  const templateV2Store = useTemplateV2(helper.truePath())()
  const infomationError = ref<any>({})

  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []

    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)  
  })

  // Tải config từ API
  const loadConfig = async () => {
    try {
      const res = await ctr_google_performance_rule.GetConfig()
      if (res.status) {
        configData.value = res.data
        conditionOptions.value = (
          Object.entries(res.data) as [ConditionType, ConditionConfig][]
        ).map(([key, config]) => ({
          label: config.name,
          value: key,
          operators: config.operator,
          valueOptions: config.value || undefined,
        }))
      }
    } catch (e) {
      console.error('Failed to load config:', e)
    }
  }

  // Helpers
  const getOperatorsForCondition = (type: ConditionType): OperatorOptions =>
    configData.value?.[type]?.operator || {}

  // placement_status
  const getDefaultOperator = () => {
    const ops = getOperatorsForCondition('placement_status' as ConditionType)
    return Object.keys(ops)[0] || null
  }

  // text_content
  const getDefaultOperatorTextContent = () => {
    const ops = getOperatorsForCondition('text_content' as ConditionType)
    return Object.keys(ops)[0] || null
  }

  // Tạo condition mới
  const createCondition = (
    conditionType: ConditionType = 'text_content'
  ): Condition => {
    const isPlacementStatus = conditionType === 'placement_status'
    return {
      condition_type: conditionType,
      condition_operator: isPlacementStatus
        ? getDefaultOperator()
        : getDefaultOperatorTextContent(),
      condition_value: isPlacementStatus ? 'unknow' : '',
    }
  }

  // Tạo logic operator mới
  const createLogicOperator = (): LogicOperator => {
    return {
      conditions: [
        createCondition('placement_status'),
        createCondition('text_content'),
      ],
    }
  }

  // Rule Data
  const getDefaultData = (): GooglePerformanceRule => ({
    id: undefined,
    name: '',
    description: '',
    auto_apply: true,
    status: '',
    status_apply: 'blacklist',
    is_and_or: true,
    is_run_daily: true,
    logic_operators: [createLogicOperator()],
  })

  // Khởi tạo dữ liệu mặc định
  const initDefaultData = () => {
    QuestionConfig.value = getDefaultData()
  }

  // Xóa dữ liệu và reset về mặc định
  const clearData = () => {
    initDefaultData()
  }

  // Thiết lập dữ liệu từ bên ngoài (dùng khi edit)
  const setData = (data: GooglePerformanceRule) => {
    QuestionConfig.value = { ...getDefaultData(), ...data }
  }

  // Logic Operators
  const addLogicOperator = () => {
    if (!QuestionConfig.value) return
    QuestionConfig.value.logic_operators.push(createLogicOperator())
  }

  const removeLogicOperator = (operatorToRemove: LogicOperator) => {
    if (
      !QuestionConfig.value ||
      QuestionConfig.value.logic_operators.length <= 1
    )
      return
    const index = QuestionConfig.value.logic_operators.indexOf(operatorToRemove)
    if (index !== -1) {
      QuestionConfig.value.logic_operators.splice(index, 1)
    }
  }

  const addCondition = (operator: LogicOperator) => {
    if (!QuestionConfig.value) return
    operator.conditions.push(createCondition())
  }

  const removeCondition = (
    operator: LogicOperator,
    conditionToRemove: Condition
  ) => {
    if (!QuestionConfig.value || operator.conditions.length <= 1) return
    const index = operator.conditions.indexOf(conditionToRemove)
    if (index !== -1) {
      operator.conditions.splice(index, 1)
    }
  }

  const updateCondition = (
    condition: Condition,
    field: keyof Condition,
    value: any
  ) => {
    if (!condition) return
    condition[field] = value
    if (field === 'condition_type') {
      condition.condition_operator = null
      condition.condition_value = value === 'query_selector' ? '||' : ''
    }
    if (
      field === 'condition_type' &&
      condition.condition_value?.includes('||') &&
      value !== 'query_selector'
    ) {
      condition.condition_value = condition.condition_value.split('||')[0] || ''
    }
  }

  // Rule Actions
  const handleRefresh = () => templateV2Store.reInitTable()

  const startRule = async (id: any, isPageList?: boolean) => {
    isLoading.value = true
    // isPageList = true thì khi chạy StartRule sẽ load lại bảng ở ngoài List
    try {
      const res = await ctr_google_performance_rule.StartRule(id)
      if (res?.status) {
        window.message.success('Start Rule Success!')
        if (isPageList) handleRefresh()
        else {
          const r = await ctr_google_performance_rule.GetByID(id)
          await setData(r.data)
        }
      }
    } catch (e) {
      window.message.error(`Error Start Rule: ${e}`)
    } finally {
      isLoading.value = false
    }
  }

  const buildSatisfyPayload = (
    id: number | string,
    opt: SatisfyRulePayload = {}
  ) => ({
    rule_id: id,
    search: opt?.search || '',
    page: opt?.page || 1,
    size: opt?.limit || 50,
    order: opt?.order || 'created_at desc',
  })

  const satisfyRule = async (
    id: number | string,
    status?: string,
    opt: SatisfyRulePayload = {}
  ) => {
    const ruleId = Number(id)
    if (currentRuleId.value !== ruleId) {
      satisfyData.value = null
      currentRuleId.value = ruleId
    }
    if (status !== undefined) statusRuleId.value = status
    const payload = buildSatisfyPayload(id, opt)
    try {
      showSatisfyModal.value = true
      isSatisfyLoading.value = true
      const res = await ctr_google_performance_rule.Satify(payload)
      satisfyData.value = res?.status ? res.data : { items: [], total: 0 }
      return satisfyData.value
    } catch {
      return { items: [], total: 0 }
    } finally {
      isSatisfyLoading.value = false
    }
  }

  const applyRule = async (id: number) => {
    const noti = window.message.loading(`Processing Apply Rule (id: ${id})`, {
      duration: 0,
    })
    isSatisfyLoading.value = true
    try {
      const res = await ctr_google_performance_rule.ApplyRule(id)
      if (res.status)
        window.message.success(`Apply Rule (id: ${id}) completed successfully`)
    } catch (e) {
      window.message.error(`Error applying rule ${e}`)
    } finally {
      noti.destroy()
      isSatisfyLoading.value = false
    }
  }

  const removeRule = async (id: number) => {
    const noti = window.message.loading(`Processing Remove Rule (id: ${id})`, {
      duration: 0,
    })
    try {
      const res = await ctr_google_performance_rule.RemoveRule(id)
      if (res.status) window.message.success(res.data)
      handleRefresh()
    } catch (e) {
      window.message.error(`Error removing rule ${e}`)
    } finally {
      noti.destroy()
    }
  }

  return {
    // Data
    name,
    isLoading,
    isLoadingSkeleton,
    mccOptions,
    configData,
    conditionOptions,
    QuestionConfig,
    showSatisfyModal,
    satisfyData,
    isSatisfyLoading,
    currentRuleId,
    statusRuleId,

    infomationError,
    showErr,

    // Methods
    loadConfig,
    clearData,
    setData,
    initDefaultData,
    // callApi,

    // Logic Operators Management
    addLogicOperator,
    removeLogicOperator,
    addCondition,
    removeCondition,
    updateCondition,
    getOperatorsForCondition,
    createCondition,
    createLogicOperator,

    //Start and Apply Rule
    startRule,
    satisfyRule,
    applyRule,
    removeRule,
  }
})
