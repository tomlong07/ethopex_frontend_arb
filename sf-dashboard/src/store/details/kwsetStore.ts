import {
  KeyWordElement,
  keywordSetType,
  PayloadCampaignsUsedType,
} from '@/types/components/keyword_set'
import { MessageReactive, SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import useCampaign2Store from '@/store/useCampaign2Store'
import { DateTimeType } from '@/types/components/types'
import date2 from '@/utils/date2'
import { ctr_keyword_set } from '@/services/ctr_keyword_set'
import { LIMIT_PAGE_VIEW } from '@/constants/limits'

export const useKeywordSetStore = defineStore('kwsetStore', () => {
  type validKeyword = 'keywords'

  const campaignStore2 = useCampaign2Store()

  const name = `keyword set`

  const isGenerating = ref(false)
  const isLoading = ref(false)
  const isLoadingKeywordAB = ref<boolean>(false)
  const isLoadingAutoOptimize = ref<boolean>(false)
  const isDisable = ref(false)
  const isSubmitBtnLoading = ref<boolean>(false)

  const messageManager = ref<MessageReactive | null>(null)
  const propDataModal = ref<any>()
  const showModalGallery = ref<boolean>(false)
  const showModalUpload = ref<boolean>(false)
  const currentEditImagePath = ref<string>('')
  const selectedKeywordIndex = ref<number>(-1)
  const selectedKeywordType = ref<'keywords'>('keywords')
  const activeKey = ref<string>('ALL')
  const countryOptions = ref<SelectOption[]>([{ label: 'ALL', value: 'ALL' }])

  const setProps = (props: any) => {
    propDataModal.value = props
  }
  const isModal = computed<boolean>(
    () => propDataModal.value.dataModal !== undefined
  )
  const isKeywordSetTab = computed(
    () => activeKey.value && activeKey.value !== 'campaigns'
  )
  const id = computed(() => {
    // refreshTrigger.value
    return isModal.value
      ? Number(propDataModal.value?.dataModal?.id || 0)
      : Number(window.route?.params?.id || 0)
  })

  const isAddPage = computed<boolean>(() => id.value === 0)
  const isEditPage = computed<boolean>(() => !isAddPage.value)

  const textShow = computed<string>(() => {
    return isAddPage.value ? 'Add' : 'Edit'
  })

  const isNormal = computed<boolean>(() => !isModal.value)
  const isShowFull = computed<boolean>(
    () => !propDataModal.value.fromCategoySiteBuilder
  )

  const isOnABTest = (new_keyword_ab_test: boolean) => {
    return new_keyword_ab_test
  }
  const newKeywordElement = () => {
    return {
      keyword: '',
      status: 'on',
    } as KeyWordElement
  }
  const getDefaultDataConfig = () => ({
    name: '',
    status: 'on',
    keywords: [newKeywordElement(), newKeywordElement(), newKeywordElement()],
    keyword_ab_test: true,
    limit_page_view: 20000,
    limit_keyword: 8,
    copyIdCampaign: '',
    rpi: 'rpc',
    demand_source: 'adsense',
    country: 'ALL',
    auto_optimize: false,
  })
  const dataConfig = ref<keywordSetType>(getDefaultDataConfig())

  const getDefaultPayloadCampaignsUsed = (): PayloadCampaignsUsedType => ({
    filter: {
      traffic_source: [],
      demand_source: [],
      status: '',
      ai_status: [],
      delivery_status: null,
      keyword_status: [],
      publisher: [],
      linked_account: [],
      account_supply: [],
      labels: [],
      created_by: null,
      bidding: [],
      start_date: '',
      end_date: '',
      filter_by: 'default',
      search: '',
    },
    page: 1,
    size: 50,
    customFilter: {},
    sort: [
      {
        field: 'id',
        dir: 'desc',
      },
    ],
  })
  const payloadCampaignsUsed = ref<PayloadCampaignsUsedType>(
    getDefaultPayloadCampaignsUsed()
  )
  const campaignsUsedStats = ref({
    total: 0,
    total_on: 0,
    total_off: 0,
  })
  const findDuplicates = (dataCheck: KeyWordElement[]) => {
    let seenKeywords: { [key: string]: boolean } = {}
    let duplicateKeywords: string[] = []

    dataCheck.forEach((item) => {
      const keyword = item.keyword.toLowerCase().trim()

      // Kiểm tra xem keyword đã xuất hiện chưa
      if (seenKeywords[keyword]) {
        if (!duplicateKeywords.includes(keyword)) {
          duplicateKeywords.push(item.keyword) // Thêm keyword vào danh sách trùng lặp
        }
      } else {
        // Đánh dấu keyword đã xuất hiện
        seenKeywords[keyword] = true
      }
    })

    return duplicateKeywords
  }

  const validateDuplicate = (keywords: KeyWordElement[]) => {
    const duplicateKeywords = findDuplicates(keywords)
    if (duplicateKeywords.length > 0) {
      errorNotify(
        `Submit failed: Duplicate keywords: ${duplicateKeywords.join(', ')}
      (Lowercase and uppercase letters are counted as identical).`,
        { keepAliveOnHover: true, closable: true, duration: 30000 }
      )
      return true
    }

    return
  }
  const errorNotify = (mess: string, options?: any) => {
    if (messageManager.value) {
      messageManager.value?.destroy()
    }

    messageManager.value = window.message.error(mess, options)
  }
  //Truyền cái new_keyword_ab_test vào để sử dụng cả trường hợp change ab test
  const validateKW = (new_keyword_ab_test: boolean) => {
    if (isOnABTest(new_keyword_ab_test)) {
      if (
        dataConfig.value.keywords.filter((item) => item.keyword.trim() === '')
          .length
      ) {
        errorNotify(`Empty keywords found!`)
        isLoadingKeywordAB.value = false
        isLoadingAutoOptimize.value = false
        return true
      }

      const stop = validateDuplicate(dataConfig.value.keywords)
      if (stop) {
        return true
      }
    }

    return false
  }
  const updateData = async (id: number, payload: any, offModal = false) => {
    const result = await ctr_keyword_set.Update(id, payload)
    if (result?.status) {
      window.message.success(`Update ${name} successfully`)

      if (isModal.value) {
        campaignStore2.updateKeywordListNow()

        if (offModal) {
          campaignStore2.changeModalKeywordset(false)
        }
      }
    }
    isLoadingKeywordAB.value = false
    isLoadingAutoOptimize.value = false
    return result
  }
  const sortKeyword = (key: keyof KeyWordElement, dir: string) => {
    if (key == 'status') {
      if (dir == 'desc') {
        dataConfig.value.keywords.sort((a, b) => {
          if (a.status === 'on' && b.status === 'off') {
            return -1 // a đứng trước b nếu status của a là 'on' và của b là 'off'
          } else if (a.status === 'off' && b.status === 'on') {
            return 1 // a đứng sau b nếu status của a là 'off' và của b là 'on'
          } else {
            return 0 // giữ nguyên vị trí nếu cả hai status đều giống nhau hoặc không có sự khác biệt giữa a và b
          }
        })
      }

      if (dir == 'asc') {
        dataConfig.value.keywords.sort((a, b) => {
          if (a.status === 'on' && b.status === 'off') {
            return 1 // a đứng trước b nếu status của a là 'on' và của b là 'off'
          } else if (a.status === 'off' && b.status === 'on') {
            return -1 // a đứng sau b nếu status của a là 'off' và của b là 'on'
          } else {
            return 0 // giữ nguyên vị trí nếu cả hai status đều giống nhau hoặc không có sự khác biệt giữa a và b
          }
        })
      }
    } else {
      if (dir == 'desc') {
        dataConfig.value.keywords.sort((a, b) => {
          if (a[key] !== undefined && b[key] !== undefined) {
            return a[key]! < b[key]! ? 1 : -1
          }
          return 0
        })
      }

      if (dir == 'asc') {
        dataConfig.value.keywords.sort((a, b) => {
          if (a[key] !== undefined && b[key] !== undefined) {
            return a[key]! > b[key]! ? 1 : -1
          }
          return 0
        })
      }
    }
  }
  const dateSearch = ref<DateTimeType>({
    startDate: date2.yesterday(),
    endDate: date2.yesterday(),
  })
  const queryDate = computed<string>(() => {
    return Object.entries(dateSearch.value)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&')
  })

  const convertCountryOptions = (list?: any[]): SelectOption[] => {
    const options = (list ?? []).map((c: any) => ({
      label: c?.name ?? c?.code ?? c,
      value: c?.code ?? c,
    }))

    return [
      { label: 'ALL', value: 'ALL' },
      ...options.filter((o) => o.value !== 'ALL'),
    ]
  }

  const getOldData = async () => {
    isDisable.value = true
    const selectedCountry = dataConfig.value.country

    try {
      const result = await ctr_keyword_set.GetByID(
        id.value,
        queryDate.value,
        dataConfig.value.country
      )

      if (result?.status) {
        dataConfig.value = {
          ...getDefaultDataConfig(),
          ...result.data,
          country: selectedCountry,
        }

        countryOptions.value = convertCountryOptions(result?.data?.country_list)

        if (!dataConfig.value.country) {
          dataConfig.value.country = 'ALL'
        }

        if (!dataConfig.value.rpi) {
          dataConfig.value.rpi = 'rpm'
        }
        if (!dataConfig.value.keywords) {
          dataConfig.value.keywords = [
            newKeywordElement(),
            newKeywordElement(),
            newKeywordElement(),
          ]
        }
        if (dataConfig.value.limit_page_view == 0) {
          if (dataConfig.value.keyword_ab_test) {
            dataConfig.value.limit_page_view = LIMIT_PAGE_VIEW
          } else {
            dataConfig.value.limit_page_view = undefined
          }
        }
      }
    } finally {
      isDisable.value = false
    }
  }
  const fetchCampaignsUsed = async () => {
    isDisable.value = true
    try {
      Object.assign(payloadCampaignsUsed.value.filter, {
        start_date: dateSearch.value.startDate,
        end_date: dateSearch.value.endDate,
      })

      const result = await ctr_keyword_set.GetCampaignsUsed(
        id.value,
        payloadCampaignsUsed.value
      )

      if (result?.status) {
        dataConfig.value.campaigns = result.data.campaigns || []
        const { total, total_on, total_off } = result.data
        campaignsUsedStats.value = { total, total_on, total_off }
        
      }
    } finally {
      isDisable.value = false
    }
  }
 
  const campaignsUsedStatsFormatted = computed(() => ({
    total:  helper.formatNumberV2(campaignsUsedStats.value.total),
    total_on:  helper.formatNumberV2(campaignsUsedStats.value.total_on),
    total_off:  helper.formatNumberV2(campaignsUsedStats.value.total_off),
  }))
  const onChangePage = (page: number) => {
    payloadCampaignsUsed.value.page = page
    fetchCampaignsUsed()
  }

  const onChangePageSize = (size: number) => {
    payloadCampaignsUsed.value.size = size
    payloadCampaignsUsed.value.page = 1
    fetchCampaignsUsed()
  }

  const updateTable = async () => {
    isSubmitBtnLoading.value = true
    await getOldData()
    isSubmitBtnLoading.value = false
  }
  const updateKeyword = (index: number, prop: validKeyword, _: string) => {
    //Tự động cắt multiple keywords thành nhiều keyword con
    if (!dataConfig.value[prop][index].keyword) {
      return
    }
    if (
      dataConfig.value[prop][index].keyword.includes(',') ||
      dataConfig.value[prop][index].keyword.includes('\n')
    ) {
      let newKeywords = helper.stringToArray(
        dataConfig.value[prop][index].keyword
      )

      if (newKeywords.length > 0) {
        dataConfig.value[prop][index] = {
          keyword: newKeywords[0],
          status: 'on',
        } as KeyWordElement

        for (let i = 1; i < newKeywords.length; i++) {
          dataConfig.value[prop].push({
            keyword: newKeywords[i],
            status: 'on',
          } as KeyWordElement)
        }

        setTimeout(() => {
          //Xóa hết các row đang rỗng
          for (let i = dataConfig.value[prop].length - 1; i >= 0; i--) {
            if (!dataConfig.value[prop][i].keyword) {
              dataConfig.value[prop].splice(i, 1)
            }
          }

          //Nếu chưa đủ 3 row thì add thêm
          if (3 - dataConfig.value[prop].length > 0) {
            for (let i = 0; i < 3 - dataConfig.value[prop].length; i++) {
              dataConfig.value[prop].push(newKeywordElement())
            }
          }
        }, 1)
      }
    }
  }
  const getMoneyCurrency = (input: any) => {
    if (input === null || input === undefined) {
      return ''
    }

    return helper.getMoneyCurrency(input)
  }
  const dataConvert = (input: any) => {
    if (input === null || input === undefined) {
      return ''
    }
    return helper.formatNumber(input)
  }
  const deleteKeyword = (index: number, prop: validKeyword) => {
    if (
      isLoading.value ||
      isDisable.value ||
      dataConfig.value[prop].length <= 1
    ) {
      return
    }

    dataConfig.value[prop].splice(index, 1)
  }
  const addKeyword = (prop: validKeyword) => {
    if (isLoading.value || isDisable.value) {
      return
    }

    dataConfig.value[prop].push(newKeywordElement())
  }
  const clearData = () => {
    // refreshTrigger.value++
    dataConfig.value = getDefaultDataConfig()
  }

  return {
    id,
    name,
    dataConfig,
    isGenerating,
    isLoading,
    isDisable,
    isAddPage,
    isModal,
    isEditPage,
    isShowFull,
    textShow,
    isNormal,
    isSubmitBtnLoading,
    messageManager,
    dateSearch,
    isLoadingKeywordAB,
    isLoadingAutoOptimize,
    showModalGallery,
    currentEditImagePath,
    selectedKeywordIndex,
    selectedKeywordType,
    showModalUpload,
    activeKey,
    countryOptions,
    isKeywordSetTab,
    payloadCampaignsUsed,
    campaignsUsedStats,
    campaignsUsedStatsFormatted,
    //method
    newKeywordElement,
    validateKW,
    setProps,
    errorNotify,
    updateData,
    sortKeyword,
    updateTable,
    getOldData,
    updateKeyword,
    dataConvert,
    getMoneyCurrency,
    addKeyword,
    deleteKeyword,
    clearData,
    fetchCampaignsUsed,
    onChangePage,
    onChangePageSize,
    
  }
})
