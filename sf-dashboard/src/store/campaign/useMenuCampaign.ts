import { defineStore } from 'pinia'
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import CreativeMenu from '@/components/campaign/modules/facebook/CreativeMenu.vue'
import CampaigFBnMenu from '@/components/campaign/modules/facebook/CampaigFBnMenu.vue'
import AdGroupMenu from '@/components/campaign/modules/facebook/AdGroupMenu.vue'
import { adGroups } from '@/types/components/campaign'
interface TabChange {
  adGroupIndex?: number
  creativeIndex?: number
  campaign?: string
  source?: string
}

export const useMenuCampaignStore = defineStore('useMenuCampaign', () => {
  const activeKey = ref<string | null>(null)
  const tabActive = reactive({
    campaignKey: 0,
    adGroupKey: 0,
    creativeKey: 0,
  })
  const collapsed = ref(false)
  const expandedKeys = ref<string[]>([])
  const menuOptions = ref<any[]>([])
  const selectedCreatives = ref<string[]>([])
  const highlightedCreatives = ref<string[]>([])
  const isSelectedAllCreative = ref(false)
  const isFirstLoad = ref(false)
  const props = ref({
    campaign: {} as campaignTypeClass,
    statusData: {} as StatusCampManager,
    FreezeData: {} as FreezeClass,
  })

  const AD_GROUPS = 'ad_groups'
  const CAMPAIGN = 'campaign'
  const CREATIVES = 'creatives'

  // Computed để lấy danh sách ad
  const listAdsUrl = computed<string[]>(() => {
    const adParam = window.route?.query.ads
    if (!adParam) return []

    const wantedIds = String(adParam)
      .split(',')
      .map((s) => Number(String(s).trim()))
      .filter((n) => !Number.isNaN(n) && n > 0)

    if (!wantedIds.length) return []

    const matchedKeys: string[] = []

    ;(props.value.campaign.ad_groups || []).forEach(
      (group: any, gIdx: number) => {
        ;(group.ad_creative || []).forEach((item: any, crIdx: number) => {
          if (wantedIds.includes(item?.id)) {
            matchedKeys.push(`${CREATIVES}-${gIdx}-ac-${crIdx}`)
          }
        })
        ;(group.creatives || []).forEach((item: any, crIdx: number) => {
          if (wantedIds.includes(item?.id)) {
            matchedKeys.push(`${CREATIVES}-${gIdx}-c-${crIdx}`)
          }
        })
      }
    )

    return [...new Set(matchedKeys)]
  })

  const trafficSource = computed(() => {
    const campaign = props.value.campaign

    return {
      isFacebook: campaign.IsTrafficFacebook(),
      isGoogle: campaign.IsTrafficGoogle(),
      isTiktok: campaign.IsTrafficTiktok(),
      isSnapchat: campaign.IsTrafficSnapchat(),
      isTaboola: campaign.IsTrafficTaboola(),
      isMgId: campaign.IsTrafficMgId(),
      isPocPoc: campaign.IsTrafficPocPoc(),
      isQuantumdex: campaign.IsTrafficQuantumdex(),
      isOutBrain: campaign.IsTrafficOutBrain(),
      isNewsbreak: campaign.IsTrafficNewsbreak(),

      //TS tỉ năm mới dùng
      isRareTrafficSource: campaign.IsRareTrafficSource(),
    }
  })

  const index = computed(() => props.value.statusData.adGroupIndex || 0)
  const adGroup = computed<adGroups | any>(() => {
    if (!props.value.campaign.ad_groups) return undefined
    return props.value.campaign.ad_groups[index.value]
  })

  const CreativeIndex = computed<number>(() => {
    const { adGroupIndex, creativeIndex } = props.value.statusData

    if (
      adGroupIndex !== undefined &&
      adGroupIndex >= 0 &&
      creativeIndex !== undefined &&
      creativeIndex >= 0
    ) {
      return creativeIndex
    }
    return 0
  })

  const adcreative = computed(() => {
    let creatives, ad_creative

    if (props.value.statusData.source === 'creatives') {
      creatives = CreativeIndex.value != null ? adGroup.value.creatives : []
    }

    if (props.value.statusData.source === 'ad_creative') {
      ad_creative = CreativeIndex.value != null ? adGroup.value.ad_creative : []
    }

    return {
      creatives,
      ad_creative,
    }
  })

  const handleShowActionButton = () => {
    const isAddPage = props.value.FreezeData.isAddPage()
    const isEditPage = props.value.FreezeData.isEditPage()
    const isDuplicateV2 = props.value.FreezeData.isDuplicatePageV2()
    const isDuplicate = props.value.FreezeData.isDuplicatePage()
    const isFirstKey = activeKey.value === expandedKeys.value.at(0)
    const isLastKey = activeKey.value === expandedKeys.value.at(-1)

    let shouldShow = false

    if (isAddPage) {
      //lần đầu vào page
      if (isFirstLoad.value) {
        if (expandedKeys.value?.length >= 1) {
          props.value.statusData.SetFirstKey(true) // hiển thị nút next
        } else {
          props.value.statusData.SetFirstKey(false)
        }
        props.value.statusData.SetLastKey(false) //  ẩn nút back
        isFirstLoad.value = false
      }

      if (
        trafficSource.value.isNewsbreak ||
        trafficSource.value.isRareTrafficSource
      ) {
        props.value.statusData.SetLastKey(false) // ẩn nút back
        props.value.statusData.SetFirstKey(false) // ẩn nút next
        props.value.statusData.SetShowActionButton(true)
        return
      } else if (
        expandedKeys.value?.length > 3 ||
        (props.value.campaign.ad_groups &&
          props.value.campaign.ad_groups?.length > 1)
      ) {
        shouldShow = true
      } else if (!isFirstKey && isLastKey) {
        shouldShow = true
      }
    }

    if (isEditPage || isDuplicate || isDuplicateV2) {
      shouldShow = true
    }
    props.value.statusData.SetLastKey(!isFirstKey)
    props.value.statusData.SetFirstKey(!isLastKey)
    props.value.statusData.SetShowActionButton(shouldShow)
  }

  const scrollToTop = () => {
    const el = document.querySelector('.main_head')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleChangeTab = (key: TabChange & { menuKey?: string }) => {
    if (key.menuKey) {
      setActiveKey(key.menuKey)
    }
    try {
      if (key.campaign) {
        props.value.statusData.setOnTab({ campaign: true })
      }
      if (Number.isInteger(key.adGroupIndex) && key.adGroupIndex !== -1) {
        props.value.statusData.setOnTab({ adGroup: true })
        props.value.statusData.setIndexTab({ adGroupIndex: key.adGroupIndex })
        tabActive.adGroupKey = Number(key.adGroupIndex)
      }
      if (
        Number.isInteger(key.adGroupIndex) &&
        Number.isInteger(key.creativeIndex) &&
        key.adGroupIndex !== -1 &&
        key.creativeIndex !== -1
      ) {
        props.value.statusData.setOnTab({ creative: true, source: key.source })
        props.value.statusData.setIndexTab({
          adGroupIndex: key.adGroupIndex,
          creativeIndex: key.creativeIndex,
        })
        tabActive.creativeKey++
      }
    } catch (error) {
      console.error('error', error)
    }
    scrollToTop()
    handleShowActionButton()
  }

  const buildCreativesMenu = (
    group: any,
    idx: number,
    onlyAdCreative: boolean = false
  ) => {
    let adCreativeMenus = []
    let creativesMenus = []

    adCreativeMenus =
      group?.ad_creative?.map((item: any, crIdx: number) => {
        const key = `${CREATIVES}-${idx}-ac-${crIdx}`
        const isHighlighted = highlightedCreatives.value.includes(key)
        return {
          label: () =>
            h(CreativeMenu, {
              keyActive: key,
              class: isHighlighted ? 'menu-highlight' : '',
              id: item.id ? String(item.id) : undefined,
              label: item.name || item.title || `Ad ${crIdx + 1}`,
              campaign: props.value.campaign,
              statusData: props.value.statusData,
              error: String(item.error || ''),
              warning: item.recommendations,
              idCreative: item.id || 0,
              source: 'ad_creative',
            }),
          key: key,
          onClick: () => {
            handleChangeTab({
              adGroupIndex: idx,
              creativeIndex: crIdx,
              menuKey: key,
              source: 'ad_creative',
            })
          },
        }
      }) ?? []

    if (onlyAdCreative) {
      return adCreativeMenus
    }
    creativesMenus =
      group?.creatives?.map((item: any, crIdx: number) => {
        const key = `${CREATIVES}-${idx}-c-${crIdx}`
        const isHighlighted = highlightedCreatives.value.includes(key)
        return {
          label: () =>
            h(CreativeMenu, {
              keyActive: key,
              class: isHighlighted ? 'menu-highlight' : '',
              label: item.name || item.title || `Ad ${crIdx + 1}`,
              campaign: props.value.campaign,
              statusData: props.value.statusData,
              error: String(item.error || ''),
              warning: item.recommendations,
              idCreative: item.id || 0,
              source: 'creatives',
              modelValue: selectedCreatives.value,
              onSelected: (val: string[]) => {
                selectedCreatives.value = val
              },
            }),
          key: key,
          onClick: () => {
            handleChangeTab({
              adGroupIndex: idx,
              creativeIndex: crIdx,
              menuKey: key,
              source: 'creatives',
            })
          },
        }
      }) ?? []

    if (
      trafficSource.value.isTiktok ||
      trafficSource.value.isNewsbreak ||
      trafficSource.value.isSnapchat
    ) {
      return adCreativeMenus
    }

    return [...adCreativeMenus, ...creativesMenus]
  }

  // const makeDataCampaign = (camp: campaignTypeClass) => {
  //   if (!camp || !trafficSource.value.isRareTrafficSource) return camp
  //   if (camp.creative && (!camp.ad_groups || camp.ad_groups.length === 0)) {
  //     return {
  //       ...camp,
  //       ad_groups: [
  //         {
  //           ad_creative: [camp.creative],
  //         },
  //       ],
  //     }
  //   }
  //   return camp
  // }

  const buildMenu = () => {
    let camp = props.value.campaign

    const isEditPage = props.value.FreezeData.isEditPage()
    const isAddPage = props.value.FreezeData.isAddPage()
    const isDuplicateV2 = props.value.FreezeData.isDuplicatePageV2()

    // camp = makeDataCampaign(camp)
    const currentExpanded = [...expandedKeys.value]

    const buildChildren = () => {
      if (!camp.ad_groups?.length) {
        // const hiddenSources = ['isTaboola', 'isNewsbreak']

        // const shouldHide = Object.entries(trafficSource.value).some(
        //   ([key, val]) => hiddenSources.includes(key) && val
        // )

        return [
          {
            label: () =>
              h('span', props.value.campaign.IsManual() ? '' : 'No Ad Groups'),
            key: `${AD_GROUPS}-empty`,
            disabled: true,
          },
        ]
      }

      if (trafficSource.value.isGoogle) {
        if (isAddPage || isDuplicateV2) {
          //k build ad Creative trong trang thêm mới của google
          return camp.ad_groups.map((group, idx) => ({
            label: () =>
              h(AdGroupMenu, {
                keyActive: `${AD_GROUPS}-${idx}`,
                label: group.name || 'Ad Set',
                campaign: camp,
                statusData: props.value.statusData,
                error: group.error ? String(group.error) : '',
              }),
            key: `${AD_GROUPS}-${idx}`,
            onClick: () =>
              handleChangeTab({
                adGroupIndex: idx,
                menuKey: `${AD_GROUPS}-${idx}`,
              }),
            children: [],
          }))
        }

        if (isEditPage) {
          return camp.ad_groups.map((group, idx) => ({
            label: () =>
              h(AdGroupMenu, {
                keyActive: `${AD_GROUPS}-${idx}`,
                label: group.name || 'Ad Set',
                campaign: camp,
                statusData: props.value.statusData,
                error: group.error ? String(group.error) : '',
              }),
            key: `${AD_GROUPS}-${idx}`,
            onClick: () =>
              handleChangeTab({
                adGroupIndex: idx,
                menuKey: `${AD_GROUPS}-${idx}`,
              }),
            children: buildCreativesMenu(group, idx, true),
          }))
        }
      }

      //isRareTrafficSource: chỉ build ad_creatives thôi
      if (trafficSource.value.isRareTrafficSource) {
        return buildCreativesMenu(camp.ad_groups[0], 0)
      }

      // build hết
      return camp.ad_groups.map((group, idx) => ({
        label: () =>
          h(AdGroupMenu, {
            keyActive: `${AD_GROUPS}-${idx}`,
            label: group.name || 'Ad Set',
            campaign: camp,
            statusData: props.value.statusData,
            error: group.error ? String(group.error) : '',
            warning: group.recommendations,
          }),
        key: `${AD_GROUPS}-${idx}`,
        onClick: () =>
          handleChangeTab({
            adGroupIndex: idx,
            menuKey: `${AD_GROUPS}-${idx}`,
          }),
        children: buildCreativesMenu(group, idx),
      }))
    }

    menuOptions.value = [
      {
        label: () =>
          h(CampaigFBnMenu, {
            keyActive: CAMPAIGN,
            label: String(camp.origin_name) || 'New Campaigns',
            campaign: camp,
            statusData: props.value.statusData,
            error: camp.create_error ? String(camp.create_error) : '',
            warning: camp.recommendations,
          }),
        key: CAMPAIGN,
        onClick: () =>
          handleChangeTab({ campaign: CAMPAIGN, menuKey: CAMPAIGN }),

        children: buildChildren(),
      },
    ]

    if (!currentExpanded.includes(CAMPAIGN)) {
      currentExpanded.push(CAMPAIGN)
    }

    buildExpandedKeys(camp)
  }

  const setActiveKey = (key: string) => {
    activeKey.value = key
  }

  const setPropsCampaign = (
    campaign: campaignTypeClass,
    statusData: StatusCampManager,
    FreezeData: FreezeClass
  ) => {
    props.value.campaign = campaign
    props.value.statusData = statusData
    props.value.FreezeData = FreezeData
  }

  //khởi tạo data
  const initDataMenu = async (
    campaign: campaignTypeClass,
    statusData: StatusCampManager,
    FreezeData: FreezeClass
  ) => {
    setPropsCampaign(campaign, statusData, FreezeData)
    props.value.statusData.setOnTab({ campaign: true })
    props.value.statusData.adGroupIndex = 0
    isFirstLoad.value = true
    setActiveKey(CAMPAIGN)
    buildMenu()
    handleShowActionButton()
  }

  const buildExpandedKeys = (camp: campaignTypeClass) => {
    if (!camp) return []
    expandedKeys.value = [
      CAMPAIGN,
      ...(camp.ad_groups?.flatMap((g, i) => [
        ...(trafficSource.value.isRareTrafficSource
          ? []
          : [`${AD_GROUPS}-${i}`]),
        ...(g.ad_creative ?? []).map((_, j) => `${CREATIVES}-${i}-ac-${j}`),
        ...(trafficSource.value.isFacebook
          ? (g.creatives ?? []).map((_, j) => `${CREATIVES}-${i}-c-${j}`)
          : []),
      ]) ?? []),
    ]

    return expandedKeys.value
  }

  const parseKey = (key: string) => {
    if (key === CAMPAIGN) {
      return { campaign: CAMPAIGN, menuKey: key }
    }
    if (key.startsWith(AD_GROUPS)) {
      const [, idx] = key.split('-')
      return { adGroupIndex: Number(idx), menuKey: key }
    }
    if (key.startsWith(CREATIVES)) {
      const parts = key.split('-')
      const adGroupIndex = Number(parts[1])
      const type = parts[2]
      const creativeIndex = Number(parts[3])
      return {
        adGroupIndex,
        creativeIndex,
        menuKey: key,
        source: type === 'c' ? 'creatives' : 'ad_creative',
      }
    }
    return { menuKey: key }
  }

  const nextTab = () => {
    if (!expandedKeys.value.length) return
    const currentIndex = expandedKeys.value.findIndex(
      (k) => k === activeKey.value
    )
    if (currentIndex === -1 || currentIndex >= expandedKeys.value.length - 1)
      return

    const key = expandedKeys.value[currentIndex + 1]
    setActiveKey(key)

    handleChangeTab(parseKey(key))
  }

  const prevTab = () => {
    if (!expandedKeys.value.length) return

    const currentIndex = expandedKeys.value.findIndex(
      (k) => k === activeKey.value
    )
    if (currentIndex <= 0) return

    const key = expandedKeys.value[currentIndex - 1]
    setActiveKey(key)

    handleChangeTab(parseKey(key))
  }

  const handleSelectAllCreatives = () => {
    const creatives = adcreative.value.creatives || []
    const groupPrefix = `${CREATIVES}-${index.value}-c-`

    const currentGroupIds = creatives.map(
      (_: any, crIdx: number) => `${CREATIVES}-${index.value}-c-${crIdx}`
    )

    const isAllSelected = currentGroupIds.every((id: string) =>
      selectedCreatives.value.includes(id)
    )

    if (isAllSelected) {
      selectedCreatives.value = selectedCreatives.value.filter(
        (id) => !id.startsWith(groupPrefix)
      )
      isSelectedAllCreative.value = false
    } else {
      const merged = new Set([...selectedCreatives.value, ...currentGroupIds])
      selectedCreatives.value = Array.from(merged)
      isSelectedAllCreative.value = true
    }
  }

  const updatePositionSelectedCreatives = () => {
    const validKeys = new Set(
      props.value.campaign.ad_groups?.flatMap((group: any, i: number) =>
        (group?.creatives ?? []).map(
          (_: any, crIdx: number) => `${CREATIVES}-${i}-c-${crIdx}`
        )
      )
    )

    selectedCreatives.value = selectedCreatives.value.filter(
      validKeys.has,
      validKeys
    )
  }

  const deleteCreativesFromAdGroup = () => {
    const adGroups = props.value.campaign.ad_groups || []

    adGroups.forEach((group: any, i: number) => {
      const creatives = group.creatives || []
      if (!creatives.length) return

      const groupPrefix = `${CREATIVES}-${i}-c-`

      if (creatives && creatives?.length > 0) {
        group.creatives = creatives.filter((creative: any, crIdx: number) => {
          const key = `${groupPrefix}${crIdx}`
          return !selectedCreatives.value.includes(key)
        })
      }
    })

    selectedCreatives.value = []
    selectedTabAdCreativePre()
  }

  // chọn tab creative cuối cùng để người dùng ko cần thêm bước chọn tab sau khi xoá creative
  const selectedTabAdCreativePre = () => {
    if (index.value === -1 && !adGroup.value) return
    const { adGroupIndex } = props.value.statusData

    if (adGroup.value.creatives && adGroup.value.creatives.length > 0) {
      // chọn creative ngay trước cái vừa xoá
      const _creativeIndex = adGroup.value.creatives?.length - 1
      handleChangeTab({
        adGroupIndex: adGroupIndex,
        creativeIndex: _creativeIndex,
        menuKey: `${CREATIVES}-${adGroupIndex}-c-${_creativeIndex}`,
        source: 'creatives',
      })
    } else if (
      adGroup.value.ad_creative &&
      adGroup.value.ad_creative?.length > 0
    ) {
      // lấy sang ad_creative cuối cùng
      const _creativeIndex = adGroup.value.ad_creative?.length - 1
      handleChangeTab({
        adGroupIndex: adGroupIndex,
        creativeIndex: _creativeIndex,
        menuKey: `${CREATIVES}-${adGroupIndex}-ac-${_creativeIndex}`,
        source: 'ad_creative',
      })
    } else {
      // ko có ad_creative và creatives thì sẽ chọn tab ad_group cha
      handleChangeTab({
        adGroupIndex: adGroupIndex,
        menuKey: `${AD_GROUPS}-${adGroupIndex}`,
      })
    }
    updatePositionSelectedCreatives()
  }

  return {
    activeKey,
    collapsed,
    expandedKeys,
    menuOptions,
    AD_GROUPS,
    CAMPAIGN,
    CREATIVES,
    props,
    selectedCreatives,
    highlightedCreatives,
    isSelectedAllCreative,
    adGroup,
    listAdsUrl,
    tabActive,

    setPropsCampaign,
    initDataMenu,
    nextTab,
    prevTab,
    handleShowActionButton,
    buildMenu,
    setActiveKey,
    handleSelectAllCreatives,
    updatePositionSelectedCreatives,
    deleteCreativesFromAdGroup,
    handleChangeTab,
    selectedTabAdCreativePre,
  }
})
