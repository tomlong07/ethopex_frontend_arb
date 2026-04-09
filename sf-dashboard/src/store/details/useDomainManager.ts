import { defineStore } from 'pinia'
import { domainManagerConfigType } from '@/types/components/types'
import ctr_demand_source from '@/services/ctr_demand_source'
import { CDN_IMAGE } from '@/constants/urls'

export default defineStore('useDomainManagerStore', () => {
  const dataDomainConfig = {
    domain: '',
    status: 'on',
    adsense_accounts: [],
    adsense_content_arb: undefined,
    config: '',
    gam_id: '',
    id: 0,
    labels: [],
  }
  const isLoading = ref(false)
  const isDisable = ref(false)
  const adsenseAccountOptions = ref<{ id: number; name: string }[]>([])
  const fetchAdsenseAccountOption = async () => {
    const result = await ctr_demand_source.GetAccount({
      object: 'adsense',
    })
    adsenseAccountOptions.value = result?.data?.accounts || []
  }
  const dataConfig = ref<domainManagerConfigType>({
    ...dataDomainConfig,
  })

  const Logo = computed(() => {
    if (!dataConfig.value) return ''
    if (dataConfig.value.logo?.includes('http')) return dataConfig.value.logo
    return CDN_IMAGE + dataConfig.value.logo
  })
  const clearData = () => {
    dataConfig.value = { ...dataDomainConfig }
  }
  return {
    dataConfig,
    isDisable,
    isLoading,
    adsenseAccountOptions,

    Logo,

    fetchAdsenseAccountOption,
    clearData,
  }
})
