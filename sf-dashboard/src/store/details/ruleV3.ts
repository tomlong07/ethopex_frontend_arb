import { useDrafting } from '@/composables/useDrafting'
import { INEX, ONOFF } from '@/enum/campaign'
import { RepeatMode, RuleVersion } from '@/enum/rule'

import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

import { ctr_user } from '@/services/ctr_user'

import { TS } from '@/enum/campaign'
import { ResponseAsyncConfigs } from '@/types/state/template'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import { ctr_bot_telegram } from '@/services/ctr_bot_telegram'
import ctr_demand_source from '@/services/ctr_demand_source'
import { ctr_rule } from '@/services/ctr_rule'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { FeSettings } from '@/class/fe_settings'
import { RuleComparisonOption } from '@/options/rule'
const { remove } = useDrafting('rule')

export class bidTypeV3 {
  bid_type?: string
  bid_unit?: string
  bid_value?: number
  bid_value_max?: number
  bid_value_min?: number
  field_comparison?: string
  field_comparison_extra?: string
  interval?: string
  include_today?: boolean

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    } else {
      this.bid_type = 'equal'
      this.bid_unit = 'currency'
    }
  }
}

export class budgetTypeV3 {
  budget_type?: string = 'equal'
  budget_unit?: string = 'currency'
  budget_value?: number
  budget_value_max?: number
  budget_value_min?: number
  reset_budget?: number
  field_comparison?: string

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

  showRuleBudgetPercent() {
    return this.budget_unit == 'percent'
  }
}

export class RuleLogic {
  name?: string | null
  interval?: string | null
  interval_exclude?: string | null
  include_today?: boolean

  conditions?: conditionTypeV3[]

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]

          if (key === 'conditions') {
            this.conditions = (element || []).map((item: any) => {
              const cleanItem = Object.keys(item).reduce((acc, itemKey) => {
                acc[itemKey] = item[itemKey] === '' ? null : item[itemKey]
                return acc
              }, {} as any)
              return new conditionTypeV3(cleanItem)
            })
          } else {
            this[key as keyof this] = element
          }
        }
      }
    }

    if (!this.conditions) {
      this.conditions = [new conditionTypeV3()]
    }
  }
}
export class duplicateCampaignTypeV3 {
  bidding?: 'bid_cap' | 'target_cpa' | null
  budget?: number | null
  custom_name?: string

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          this[key as keyof this] = data[key]
        }
      }
    }
  }
}

export class RuleTypeV3 {
  name?: string
  description?: string
  status?: ONOFF = ONOFF.ON
  rule_type?: string | null
  version?: RuleVersion | null
  add_campaign: addCampaignTypeV3 = new addCampaignTypeV3()
  duplicate_campaign: duplicateCampaignTypeV3 = new duplicateCampaignTypeV3()
  apply_bidding_strategy?: 'bid_cap' | 'target_cpa' | null
  interval?: string | null //Considering Data From
  include_today?: boolean
  interval_exclude?: string | null //Exclude Days From Interval
  schedule?: string | null
  time_schedule_every_by_day?: string | null
  time_schedule_number?: number | null
  time_schedule_hour?: string | null
  time_schedule_min?: string | null
  rule_global?: boolean
  status_preview?: ONOFF
  daily_reset?: ONOFF | null
  repeat_mode?: RepeatMode | null
  repeat_interval_hour?: number | null
  is_notify_telegram?: string
  bot_id?: number | null
  chat_id?: number | null
  topic_id?: number | null
  traffic_sources?: string[] = []
  demands?: string[] = []
  apply_user?: number[] = []
  apply_country?: string[] = []
  apply_location_fb?: string[] = []
  apply_type?: INEX | null = INEX.INCLUDE
  apply_campaigns?: number[] = []
  apply_keyword_set?: number[] = []
  apply_fb_option_target?: string[] = []
  apply_type_delivery_status?: INEX | null = INEX.INCLUDE
  apply_delivery_status?: string[] = []
  apply_bidding?: string[] = []
  apply_section_type?: INEX | null = INEX.INCLUDE
  apply_sections?: string[] = []
  apply_account_label?: string[] = []
  apply_tag_type?: INEX | null = INEX.INCLUDE
  apply_tag_campaign?: string[] = []
  apply_account_promotion_status?: string[] = []
  conditions?: conditionTypeV3[]
  rule_logics?: RuleLogic[]
  bid?: bidTypeV3 = new bidTypeV3()
  budget?: budgetTypeV3 = new budgetTypeV3()
  time_hour_start?: string | null
  time_min_start?: string | null
  time_hour_end?: string | null
  time_min_end?: string | null
  time_reset_hour?: string | null
  time_reset_min?: string | null
  apply_object_type_cp?: string | null
  apply_performance_goal?: string | null
  apply_ad_account?: string | null
  main_interval?: string | null
  rollback_after_days?: number | null
  apply_rule?: number[] = []

  constructor(data?: any, isDraft?: boolean) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (element === '') {
            continue
          }

          if (element) {
            switch (key) {
              case 'add_campaign':
                this['add_campaign'] = new addCampaignTypeV3(element)
                break

              case 'bid':
                this['bid'] = new bidTypeV3(element)
                break

              case 'budget':
                this['budget'] = new budgetTypeV3(element)
                break

              case 'traffic_sources':
                if (isDraft) {
                  this['traffic_sources'] = element || []
                } else {
                  this['traffic_sources'] =
                    (element?.map((item: any) => item.value) as string[]) || []
                }

                break

              case 'demands':
                if (isDraft) {
                  this['demands'] = element || []
                } else {
                  this['demands'] =
                    (element?.map((item: any) => item.value) as string[]) || []
                }
                break

              case 'apply_campaigns':
                if (isDraft) {
                  this['apply_campaigns'] = element || []
                } else {
                  this['apply_campaigns'] =
                    (element?.map((item: any) => item.id) as number[]) || []
                }
                break

              case 'conditions':
                this['conditions'] = (element || []).map(
                  (item: any) => new conditionTypeV3(item)
                )
                break
              case 'rule_logics':
                this['rule_logics'] = (element || []).map((ruleLogic: any) => {
                  return new RuleLogic(ruleLogic)
                })

                break
              case 'duplicate_campaign':
                this['duplicate_campaign'] = new duplicateCampaignTypeV3(
                  element
                )
                break
              default:
                this[key as keyof this] = element
                break
            }
          }
        }
      }
    } else {
      this.conditions = [new conditionTypeV3()]
    }

    if (!this.version) {
      this.version = RuleVersion.V1
    }

    if (!this.repeat_mode) this.repeat_mode = RepeatMode.RuleRepeatModeTYPENone
  }

  IsHasTSFacebook() {
    return this.traffic_sources?.includes(TS.FACEBOOK)
  }

  IsHasPerformanceGoal() {
    return (
      this.IsHasTSFacebook() &&
      ['unblock_ad_group', 'block_ad_group', 'change_bid_ad_group'].includes(
        this.rule_type || ''
      )
    )
  }

  isVersion1() {
    return this.version === RuleVersion.V1
  }

  isVersion2() {
    return this.version === RuleVersion.V2
  }

  isBlockCampaign() {
    return this.rule_type === 'block_campaign'
  }

  isChangeBidCampaign() {
    return this.rule_type === 'change_bid_campaign'
  }

  isRuleStopCampaign() {
    return this.rule_type === 'off_campaign'
  }

  isRuleBid() {
    return [
      'change_bid_campaign',
      'change_bid_section',
      'change_bid_ad_group',
    ].includes(this.rule_type || '')
  }

  isRuleBudget() {
    return ['change_budget', 'reset_budget', 'change_budget_ad_group'].includes(
      this.rule_type || ''
    )
  }

  isRuleChangeBudget() {
    return ['change_budget', 'change_budget_ad_group'].includes(
      this.rule_type || ''
    )
  }

  isBidPercent() {
    return this.bid?.bid_unit === 'percent'
  }

  isAddCampaignRule() {
    return this.rule_type === 'add_campaign'
  }

  isAddDuplicateRule() {
    return this.rule_type === 'duplicate_campaign'
  }

  isDataFromLink() {
    return this.isAddCampaignRule() && this?.add_campaign?.data_from === 'link'
  }

  isNotDataFromLink() {
    return !this.isDataFromLink()
  }

  isDataFromReport() {
    return this.isAddCampaignRule() && this?.add_campaign?.data_from == 'report'
  }

  isDataFromListCampaign() {
    return (
      this.isAddCampaignRule() &&
      this?.add_campaign?.data_from === 'list_campaign_origin'
    )
  }

  isShowEveryByDay() {
    return this.schedule === 'every_custom_day'
  }

  isShowTime() {
    if (this.isRuleStopCampaign()) return false
    return ['daily', 'weekly', 'every_custom_day'].includes(this.schedule || '')
  }

  isShowSchedule() {
    return !['day_unit', 'hour_unit', 'minute_unit'].includes(
      this.schedule || ''
    )
  }

  isShowHour() {
    return this.schedule !== 'hour_unit' && this.schedule !== 'minute_unit'
  }

  isShowMinute() {
    return this.schedule !== 'minute_unit'
  }

  isOnTelegram() {
    return this.is_notify_telegram == ONOFF.ON
  }

  Payload() {
    return {
      ...helper.clone(this),
      traffic_sources: this.traffic_sources?.map((value) => ({ value })) || [],
      demands: this.demands?.map((value) => ({ value })) || [],
      apply_campaigns: this.apply_campaigns?.map((id) => ({ id })) || [],
      repeat_mode:
        this.repeat_mode === RepeatMode.RuleRepeatModeTYPENone
          ? null
          : this.repeat_mode,
    }
  }

  assignData(data: any) {
    return Object.assign(this, data)
  }
}

export class conditionTypeV3 {
  comparison?: string | null
  comparison_field?: string | null
  comparison_type?: string | null
  field_extra?: string | null
  comparison_field_extra?: string | null
  field?: string | null
  value?: number

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element === '' ? null : element
        }
      }
    }
  }
}

class addCampaignTypeV3 {
  data_from?: string | null
  landing_page_type?: string | null
  data_source?: string | null
  list_link?: string[]
  delay?: number
  limit_campaign?: number
  conditions?: conditionTypeV3[]
  list_campaign_origin?: number[]
  interval?: string | null //Considering Data From
  apply_bidding_type?: string[]
  bidding_type?: string | null
  campaign_type?: string | null
  goals?: string | null
  label?: number | null
  search_to_search?: ONOFF | null
  account_supply_id?: number | null
  landing_page?: string | null
  bidding?: number | null
  bidding_mode?: string | null
  budget?: number | null
  country?: string | null
  language?: string[]
  creative?: number | null
  search_network?: boolean
  display_network?: boolean

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]

          switch (key) {
            case 'conditions':
              this['conditions'] = (element || []).map(
                (item: any) => new conditionTypeV3(item)
              )
              break

            default:
              this[key as keyof this] = element

              break
          }
        }
      }
    }
  }

  IsDynamic() {
    return this.data_source === 'dynamic'
  }

  IsFixed() {
    return this.data_source === 'fixed'
  }

  IsLandingTypeCustom() {
    return this.landing_page_type === 'custom'
  }

  IsOffS2S() {
    return this.search_to_search === ONOFF.OFF
  }
}

export default defineStore('useRuleStoreV3', () => {
  const ruleV3 = ref<RuleTypeV3>(new RuleTypeV3())
  const id = ref<number>(0)
  const isClonePage = ref<boolean>(false)

  const feSettings = ref<FeSettings>()

  const isDisable = ref(false)
  const isLoading = ref(true)
  const loadingBot = ref<boolean>(false)
  const loadingChat = ref<boolean>(false)
  const loadingTS = ref<boolean>(false)
  const loadingDS = ref<boolean>(false)
  const loadingUser = ref<boolean>(false)
  const loadingLocationsGoogle = ref<boolean>(false)
  const loadingLocationsFacebook = ref<boolean>(false)
  const loadingCampaign = ref<boolean>(false)
  const loadingKWSet = ref<boolean>(false)
  const loadingAdAcc = ref<boolean>(false)
  const loadingApplyRule = ref<boolean>(false)

  const loadingLabel = ref<boolean>(false)
  const showModal = ref<boolean>(false)
  const isSubmitBtnLoading = ref<boolean>(false)
  const loadingOpsTarget = ref<boolean>(false)
  const loadingCampaignTags = ref<boolean>(false)

  const ruleTypeOption = ref<SelectOption[]>([])
  const listBot = ref<SelectOption[]>([])
  const listChat = ref<SelectOption[]>([])
  const trafficSourceOptions = ref<SelectOption[]>([])
  const demandSourceOptions = ref<SelectOption[]>([])
  const userOptions = ref<SelectOption[]>([])
  const locationOptionsGoogle = ref<SelectOption[]>([])
  const locationOptionsFacebook = ref<SelectOption[]>([])
  const campaignOptions = ref<SelectOption[]>([])
  const keywordSetOption = ref<SelectOption[]>([])
  const AdAccountOption = ref<SelectOption[]>([])
  const ApplyRuleOption = ref<SelectOption[]>([])

  const domainLabelOptions = ref<SelectOption[]>([])
  const optionTarget = ref<SelectOption[]>([])
  const campaignTags = ref<SelectOption[]>([])
  const campaignTagsSearch = ref<SelectOption[]>([])

  const campaignMapName = ref<Record<number, string>>({})

  const ruleTypeOptionLoading = ref(false)

  const asyncConfigs = ref<ResponseAsyncConfigs>({})

  const typeModal = ref<string>('campaign')

  const multipleEntries = ref<string>('')

  const infomationError = ref<any>({})

  const intervalOptions = ref<SelectOption[]>([])

  const isCampaignStatus = (field: string | null | undefined) =>
    field === 'campaign_status'

  const isAddPage = computed(() => {
    return id.value === 0
  })

  const isEditPage = computed(() => {
    return !isAddPage.value
  })

  const isSectionChoose = computed<boolean>(() => {
    if (!ruleV3.value.rule_type || !ruleTypeOption.value?.length) {
      return false
    }

    const ruleType = ruleTypeOption.value.find(
      (item) => item.value === ruleV3.value.rule_type
    )

    return ruleType?.section ? true : false
  })

  const isShowInputResetBudget = computed(() => {
    if (
      !ruleV3.value?.rule_type ||
      ruleV3.value.rule_type === 'reset_budget' ||
      !ruleTypeOption.value?.length
    )
      return false

    const ruleType = ruleTypeOption.value.find(
      (item) => item.value === ruleV3.value?.rule_type
    )

    if (!ruleType) return false

    return ruleV3.value.isRuleBudget()
  })

  const initData = (data?: any) => {
    infomationError.value = {}
    ruleV3.value = new RuleTypeV3(data)

    if (isAddPage.value) {
      ruleV3.value.version = RuleVersion.V2
    }

    if (data?.apply_campaigns) {
      campaignMapName.value = Object.fromEntries(
        data.apply_campaigns.map((c: { id: number; name: string }) => [
          c.id,
          c.name,
        ])
      )
    }

    if (data?.traffic_sources) {
      ruleV3.value.traffic_sources = data.traffic_sources.map(
        (item: { value: string }) => item.value
      )
    }

    if (data?.demands) {
      ruleV3.value.demands = data.demands.map(
        (item: { value: string }) => item.value
      )
    }

    if (data?.apply_campaigns) {
      ruleV3.value.apply_campaigns = data.apply_campaigns.map(
        (item: { id: number }) => item.id
      )
    }
  }

  const getComparisonOptions = (field: string) => {
    return isCampaignStatus(field)
      ? RuleComparisonOption.filter((item) => item.value === 'equal')
      : RuleComparisonOption
  }

  const onRuleConditionChange = (
    value: string | null,
    indexes: { ruleIndex?: number; conditionIndex: number },
    mode: 'ruleV1' | 'ruleV2'
  ) => {
    const { ruleIndex, conditionIndex } = indexes

    const condition =
      mode === 'ruleV2'
        ? ruleV3.value.rule_logics?.[ruleIndex!]?.conditions?.[conditionIndex]
        : ruleV3.value.conditions?.[conditionIndex]

    if (!condition) return

    condition.field = value

    if (!isCampaignStatus(value)) return

    const fieldsToClear = [
      'comparison',
      'comparison_type',
      'comparison_field',
      'comparison_field_extra',
      'field_extra',
    ] as const

    fieldsToClear.forEach((key) => {
      condition[key] = null
    })

    if (typeof condition.value === 'number') {
      condition.value = undefined
    }
  }

  const getRuleTypeOptions = async () => {
    ruleTypeOptionLoading.value = true
    let result = await ctr_rule.GetRuleType()

    ruleTypeOption.value = Object.entries(
      (result.data as [string: any]) || []
    ).map(([_, value]) => {
      return {
        label: String(value.name),
        value: String(value.value),
        section: value.section,
      }
    })

    ruleTypeOptionLoading.value = false
  }

  const fetchPermissionAsyncConfigs = async (path?: string) => {
    if (!path) return
    const result = await ctr_permission_settings.PermissionAsync(
      path || helper.truePath()
    )

    asyncConfigs.value = result.data || {}
  }

  const getListBot = async () => {
    loadingBot.value = true
    const result = await ctr_bot_telegram.ListBot()
    listBot.value = result?.data || []

    loadingBot.value = false
  }

  const getListChat = async () => {
    loadingChat.value = true
    const result = await ctr_bot_telegram.ListChat()
    listChat.value = result?.data || []

    loadingChat.value = false
  }

  const getTrafficSourceOptions = async () => {
    loadingTS.value = true
    let result = await ctr_traffic_source.GetAllTrafficSource()

    trafficSourceOptions.value = result?.data?.traffic_sources || []

    loadingTS.value = false
  }

  const getDemandSourceOptions = async () => {
    loadingDS.value = true

    let result = await ctr_demand_source.GetAllDemandSource()
    demandSourceOptions.value = result?.data?.demand_sources || []

    loadingDS.value = false
  }

  const getUserOptions = async () => {
    loadingUser.value = true
    let result = await ctr_user.GetAllUser()
    userOptions.value = result?.data || []

    loadingUser.value = false
  }

  const fetchLocationsGoogle = async () => {
    loadingLocationsGoogle.value = true
    const result = await ctr_traffic_source.GetCountries({
      traffic_source: TS.GOOGLE,
    })

    locationOptionsGoogle.value = result?.data?.coutries || []
    loadingLocationsGoogle.value = false
  }
  const fetchLocationsFacebook = async () => {
    loadingLocationsFacebook.value = true
    const result = await ctr_traffic_source.GetCountries({
      traffic_source: TS.FACEBOOK,
    })

    locationOptionsFacebook.value = result?.data?.coutries || []
    loadingLocationsFacebook.value = false
  }

  const fetchDomainLabelOptions = async () => {
    loadingLabel.value = true

    const result = await ctr_filter_v2.GetFilterSupplyAccountAdLabel()
    domainLabelOptions.value = result?.data || []
    loadingLabel.value = false
  }

  const fetchCampaignTags = async (params: string = '') => {
    loadingCampaignTags.value = true

    const result = await ctr_filter_v2.GetFilterCampaignTags({
      search: params,
    })
    const valueTags = (result.data || []).map((item: any) => ({
      label: item,
      value: item,
    }))
    const isSearching = params !== ''
    campaignTags.value = valueTags
    if (isSearching) {
      campaignTagsSearch.value = valueTags
    }
    loadingCampaignTags.value = false
  }

  const submitForm = async () => {
    try {
      isSubmitBtnLoading.value = true

      if (isAddPage.value) {
        const result = await ctr_rule.AddPost(ruleV3.value.Payload())
        if (result.status) {
          window.message.success(`Submit success!`)
          localStorage.removeItem('saveData1')
          remove()

          if (feSettings.value?.page_list) {
            window.router.push({ path: feSettings.value?.page_list })
          }
        } else {
          infomationError.value = result
        }
      } else {
        if (isClonePage.value) {
          const result = await ctr_rule.ClonePost(
            id.value,
            ruleV3.value.Payload()
          )
          if (result.status) {
            window.message.success(`Clone Rule success!`)
            if (feSettings.value?.page_list) {
              window.router.push({ path: feSettings.value?.page_list })
            }
          } else {
            infomationError.value = result
          }
        } else {
          const result = await ctr_rule.EditPost(
            id.value,
            ruleV3.value.Payload()
          )
          if (result.status) {
            window.message.success(`Edit Rule success!`)
          } else {
            infomationError.value = result
          }
        }
      }
      isSubmitBtnLoading.value = false
    } catch {
      isSubmitBtnLoading.value = false
    }
  }
  function getValueById(form: any, error: { id: string; indexs?: number[] }) {
    const { id, indexs = [] } = error
    const isV2 = form.isVersion2?.()

    if (isV2) {
      switch (id) {
        case 'logic_name':
          return form.rule_logics?.[indexs[0]]?.name
        case 'field':
          return form.rule_logics?.[indexs[0]]?.conditions?.[indexs[1]]?.field
        case 'comparison':
          return form.rule_logics?.[indexs[0]]?.conditions?.[indexs[1]]
            ?.comparison
        default:
          return form[id]
      }
    }

    // version 1
    if (!id.includes(':')) return form[id]

    const [key, i] = id.split(':').map((x) => (isNaN(+x) ? x : +x))

    switch (key) {
      case 'logic_name':
        return form.rule_logics?.[i]?.name
      case 'field':
        return form.conditions?.[i]?.field
      case 'comparison':
        return form.conditions?.[i]?.comparison
      default:
        return form[key]
    }
  }

  function hasValue(val: any) {
    if (val == null) return false
    if (typeof val === 'string') return val.trim().length > 0
    return true
  }

  function buildKey(error: { id: string; indexs?: number[] }, isV2: boolean) {
    if (!isV2) return error.id
    if (!error.indexs || error.indexs.length === 0) return error.id
    return `${error.id}:${error.indexs.join(':')}`
  }

  const showErr = computed(() => {
    const _errors: any[] = infomationError.value?.errors || []
    const isV2 = ruleV3.value.isVersion2?.() ?? false

    return _errors.reduce((acc, err) => {
      const value = getValueById(ruleV3.value, err)
      if (!hasValue(value)) {
        acc[buildKey(err, isV2)] = err.message
      }
      return acc
    }, {} as Record<string, string>)
  })

  const loadIntervalOptions = async () => {
    try {
      const res = await ctr_rule.GetInterval()

      if (res.status && res.data) {
        intervalOptions.value = res.data.map((item: any) => ({
          label: item.name,
          value: item.value,
        }))
      }
    } catch (e) {
      console.error('Failed to load interval options:', e)
    }
  }

  return {
    ruleV3,
    isDisable,
    isLoading,
    ruleTypeOption,
    ruleTypeOptionLoading,
    isClonePage,
    id,
    asyncConfigs,
    loadingBot,
    listBot,
    loadingChat,
    listChat,
    trafficSourceOptions,
    demandSourceOptions,
    userOptions,
    loadingTS,
    loadingDS,
    loadingUser,
    typeModal,
    multipleEntries,
    isCampaignStatus,
    getComparisonOptions,
    onRuleConditionChange,
    showModal,
    locationOptionsGoogle,
    loadingLocationsGoogle,
    locationOptionsFacebook,
    loadingLocationsFacebook,
    loadingCampaign,
    campaignOptions,
    campaignMapName,
    keywordSetOption,
    AdAccountOption,
    loadingKWSet,
    loadingAdAcc,
    domainLabelOptions,
    loadingLabel,
    isSubmitBtnLoading,
    optionTarget,
    loadingOpsTarget,
    feSettings,
    loadingApplyRule,
    ApplyRuleOption,

    campaignTags,
    loadingCampaignTags,
    campaignTagsSearch,

    isAddPage,
    isEditPage,
    isSectionChoose,
    isShowInputResetBudget,
    infomationError,

    showErr,

    initData,
    getRuleTypeOptions,
    fetchPermissionAsyncConfigs,
    getListBot,
    getListChat,
    getTrafficSourceOptions,
    getDemandSourceOptions,
    getUserOptions,
    fetchLocationsGoogle,
    fetchLocationsFacebook,
    fetchDomainLabelOptions,
    fetchCampaignTags,
    submitForm,

    intervalOptions,
    loadIntervalOptions,
  }
})
