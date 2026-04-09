import { defineStore } from 'pinia'
import { ConfigAB, domainConfigType } from '@/types/components/domain_config'
import { SelectOption } from 'naive-ui'
import { ModeClass } from '@/types/components/base'
import { ctr_domain } from '@/services/ctr_domain'
import { ONOFF } from '@/enum/campaign'
export default defineStore('useDomainConfigStore', () => {
  const name = 'Domain Config'
  const isLoading = ref(false)
  const isDisable = ref(false)
  const isSubmitBtnLoading = ref<boolean>(false)

  const activeTab = ref('form')

  const showModalLogs = ref(false)
  const modeData = ref<ModeClass>(new ModeClass(window.route))
  const initId = new ModeClass(window.route)
  const id = initId.id
  const isLoadingAdsenseAccount = ref(false)
  const adsenseAccountOptions = ref<SelectOption[]>([])
  const isLoadingAdsenseAccountBackup = ref(false)
  const adsenseAccountOptionsBackup = ref<SelectOption[]>([])
  const domainOptionsMap = ref<Record<number, SelectOption[]>>({})

  const domainOptions = ref<SelectOption[]>([])
  const showModalBulk = ref<boolean>(false)
  const dataBulk = ref<string>('')
  const isLoadingCamp = ref(false)
  const page = ref<number>(1)

  const dataCampaignModal = ref<any[]>([])
  const showModal = ref<boolean>(false)

  const pageSize = ref<number>(50)
  const makeOptions = (res: any, accountId: number) => {
    return res.data?.length
      ? res.data
          .filter((el: any) => el.account_id === accountId)
          .flatMap(
            (el: any) =>
              el.domains?.map((e: any) => ({
                value: e.id,
                label: e.domain,
              })) || []
          )
      : []
  }

  const makeOptionDomain = (res: any, domainId: number) => {
    return res.data?.length
      ? res.data
          .filter((el: any) => el.domain_id === domainId)
          .flatMap(
            (el: any) =>
              el.adsense_accounts?.map((e: any) => ({
                value: e.id,
                label: e.show_name,
              })) || []
          )
      : []
  }

  const prefetchDomainForAdsenses = async (accountId: number[]) => {
    const ids = Array.from(new Set(accountId.filter(Boolean))) as number[]
    if (!ids.length) return

    const idsToFetch = ids.filter((id) => !domainOptionsMap.value[id])
    if (!idsToFetch.length) return

    const res = await ctr_domain.GetDomainByAccount(idsToFetch)

    idsToFetch.forEach((id) => {
      domainOptionsMap.value[id] = makeOptions(res, id)
    })
  }

  const getDomainOptions = async (accountId: number) => {
    if (!accountId) return []
    if (!domainOptionsMap.value[accountId]) {
      await prefetchDomainForAdsenses([accountId])
    }

    return domainOptionsMap.value[accountId] || []
  }

  const createDefaultConfig = (): ConfigAB => ({
    status: ONOFF.ON,
    domain: null,
    priority: null,
    account_adsense: null,
  })

  const dataDomainConfig = {
    id: id || undefined,
    name: '',
    status: 'on',
    description: '',
    domain_id: undefined,
    traffic_sources_type: 'include',
    traffic_sources: [],
    mcc_type: '',
    ad_accounts_type: 'include',
    ad_accounts: [],
    labels_type: 'include',
    labels: [],
    adsense_accounts: [],
    campStatus: '',
    search: '',
    logs: '',
    logs_domain_config: [],
    config_ab_test: [],
    traffics_ab_test: null,
  }

  const dataConfig = ref<domainConfigType>({
    ...dataDomainConfig,
  })
  const editDomainConfig = async () => {
    const result = await ctr_domain.UpdateDomainConfig(dataConfig.value)
    if (result?.status) {
      window.message.success(`Update ${name} successfully`)
      getCampaignsInDomainConfig()
    }
  }
  const clearDataDomainConfig = () => {
    dataConfig.value = {
      ...dataDomainConfig,
      config_ab_test: [createDefaultConfig()],
    }
  }
  const dataCampaigns = ref<any[]>([])
  const recordsTotalOn = ref<number>(0)
  const recordsTotalOff = ref<number>(0)
  const recordsTotal = ref<number>(0)

  const getListAdsenseAccountByDomainIds = async (domainId: number) => {
    isLoadingAdsenseAccount.value = true
    let res = await ctr_domain.GetAdsenseByDomain([domainId])

    adsenseAccountOptions.value = makeOptionDomain(res, domainId)

    isLoadingAdsenseAccount.value = false
  }
  const getListAdsenseAccountByDomainIdsBackup = async (domainId: number) => {
    if (!domainId) return
    isLoadingAdsenseAccountBackup.value = true
    let res = await ctr_domain.GetAdsenseByDomain([domainId])

    adsenseAccountOptionsBackup.value = makeOptionDomain(res, domainId)

    isLoadingAdsenseAccountBackup.value = false
  }
  const getCampaignsInDomainConfig = async () => {
    isLoadingCamp.value = true
    const result = await ctr_domain.GetCampaignsByDomainConfig({
      labels: dataConfig.value.labels,
      ad_accounts: dataConfig.value.ad_accounts,
      traffic_sources: dataConfig.value.traffic_sources,
      page: page.value,
      size: pageSize.value,
      status: dataConfig.value.campStatus,
      search: dataConfig.value.search,
    })

    dataCampaigns.value = result?.data?.items || []
    recordsTotal.value = result?.data?.recordsTotal || 0
    recordsTotalOff.value = result?.data?.recordsTotalOff || 0
    recordsTotalOn.value = result?.data?.recordsTotalOn || 0
    isLoadingCamp.value = false
  }
  const preIdRoute = () => {
    modeData.value = new ModeClass(window.route)
  }

  const updateConfigABTest = (configData: any[]) => {
    if (!dataConfig.value.config_ab_test) {
      dataConfig.value.config_ab_test = []
    }
    dataConfig.value.config_ab_test = configData
  }

  return {
    name,
    dataConfig,
    isLoading,
    isDisable,
    makeOptions,
    domainOptions,
    adsenseAccountOptions,
    adsenseAccountOptionsBackup,
    domainOptionsMap,
    prefetchDomainForAdsenses,
    getDomainOptions,
    getListAdsenseAccountByDomainIds,
    getListAdsenseAccountByDomainIdsBackup,
    dataBulk,
    showModalBulk,
    getCampaignsInDomainConfig,
    page,
    pageSize,
    recordsTotal,
    recordsTotalOn,
    recordsTotalOff,
    dataCampaigns,
    isLoadingCamp,
    clearDataDomainConfig,
    preIdRoute,
    modeData,
    showModal,
    dataCampaignModal,
    editDomainConfig,
    showModalLogs,
    activeTab,
    isSubmitBtnLoading,
    isLoadingAdsenseAccount,
    updateConfigABTest,
    createDefaultConfig,
  }
})
