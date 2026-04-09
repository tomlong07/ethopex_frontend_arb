import {
  FreezeClass,
  isDefaultZero,
  campaignTypeClass,
  StatusCampManager,
  adGroups,
  CreativeSingleImageDefault,
} from '@/types/components/campaign-v2'
import storage from '@/plugins/storage'
import { fixDataHandle } from '@/components/campaign/help/FixData'
import { ctr_campaign } from '@/services/ctr_campaign'
import {
  CREATE_CAMP,
  DS,
  DUPLICATE_TYPE,
  ONOFF,
  PLACEMENT_TYPE,
  TS,
} from '@/enum/campaign'
import { URL_UPLOAD } from '@/constants/urls'

export function campMethod(
  campaign: Ref<campaignTypeClass>,
  FreezeData: FreezeClass,
  statusData: Ref<StatusCampManager>
) {
  const deleteNullProp = () => {
    if (!campaign.value) return

    const obj = campaign.value as Record<string, any>

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (isDefaultZero(key)) continue

        if (obj[key] == null || obj[key] === '') {
          delete obj[key]
        }
      }
    }
  }

  const beforeMountHandle = () => {
    // if (FreezeData.isAddPage()) {
    //   storage.initWatchV2(campaign, statusData)
    // }

    if (FreezeData.isEditPage()) {
      // Listen for when the user clicks on fields that affect the name, then start watching for name changes
      window.addEventListener('click', function (event) {
        const targetElement = event.target

        if (!statusData.value.isLoading && !statusData.value.userClick) {
          if (targetElement instanceof Element) {
            if (
              targetElement.classList.contains('name-affect-comp') ||
              targetElement.closest('.name-affect-comp')
            ) {
              statusData.value.userClick = true
            }
          }
        }
      })
    }
  }

  const fetchPermission = async (traffic_source: string) => {
    const [permissionOptions, campaignConfigs] = await Promise.all([
      ctr_campaign.CampaignConfigs({
        logging: true,
        verify: true,
        prelanding: true,
        label: true,
        landing_by_creative: true,
        path: window.route?.meta?.url,
      }),

      ctr_campaign.CampaignConfigsCreateCampaign(traffic_source),
    ])

    statusData.value.permission = permissionOptions?.data || {}
    statusData.value.permission.create_campaign = campaignConfigs?.data || {}
  }

  const fetchCampaignGetById = async (ts?: string, loading: boolean = true) => {
    if (loading) {
      statusData.value.isLoading = true
    }

    const campResult = await ctr_campaign.GetByID(FreezeData.id)

    if (campResult?.status) {
      if (
        campResult.data?.ad_formats?.unlock_content?.status === 'on' &&
        !campResult.data?.ad_formats?.unlock_content?.type
      ) {
        campResult.data.ad_formats.unlock_content.type = 'default'
      }

      campaign.value = new campaignTypeClass(campResult.data)

      deleteNullProp()

      if (
        campaign.value.IsTrafficFacebook() &&
        campaign.value.IsAPI() &&
        campaign.value.ad_groups
      ) {
        campaign.value.ad_groups.forEach((ad: adGroups) => {
          ad.ad_creative?.forEach((item) => {
            item.creative_features_spec = !item.creative_features_spec
              ? CreativeSingleImageDefault()
              : item.creative_features_spec
          })
        })
      }
      if (
        campaign.value.IsTrafficGoogle() &&
        campaign.value.IsAPI() &&
        campaign.value.ad_groups
      ) {
        //Xóa hết các creative của adgroup để ko select vào -> tạo sai//
        try {
          for (
            let index = 0;
            index < campaign.value.ad_groups.length;
            index++
          ) {
            campaign.value.ad_groups[index].creatives = []
          }
        } catch {}
      }

      if (
        campaign.value.IsHasPurchaseValue() &&
        campaign.value.IsAPI() &&
        (window.arb.isAdmin() || window.arb.isDev() || window.arb.isAnt()) &&
        !campaign.value.purchase_value
      ) {
        campaign.value.SetDefaultPurchaseValue()
      }

      if (ts) {
        const urlRedirect = 'campaign'
        if (!campaign.value.traffic_source) {
          window.message.warning(
            'Traffic source is missing. Please check again'
          )
          return
        }
        if (campaign.value.traffic_source !== ts) {
          window.router.push({
            path: `/${urlRedirect}/${campaign.value?.traffic_source}/${FreezeData.id}`,
          })
          return
        }
      }
    }

    statusData.value.isLoading = false
  }

  const submitForm = async (
    payload: Ref,
    feSettings: Ref,
    getById?: boolean
  ) => {
    try {
      statusData.value.isSubmitBtnLoading = true
      if (FreezeData.isAddPage() || FreezeData.isDuplicatePage()) {
        if (
          payload.value.traffic_source === TS.POCPOC ||
          ![DS.ADSENSE, DS.PUBPOWER].includes(
            payload.value.demand_source as any
          )
        ) {
          //Poc poc set thoải mái
          //ngoài 2 cái google, pubpower thì demand khác set thoải mái
        } else {
          if (payload.value.demand_source === DS.PUBPOWER) {
            payload.value.landing_page_by_creative = ONOFF.OFF //Off cho chắc sợ handle thiếu chỗ nào đó
          } else {
            //Lead đc phép tắt

            if (
              !window.arb.isLead() &&
              !window.arb.isAdmin() &&
              payload.value.prelanding === ONOFF.OFF &&
              payload.value.create_campaign === CREATE_CAMP.API
            ) {
              payload.value.landing_page_by_creative = ONOFF.ON //On cho chắc sợ handle thiếu chỗ nào đó
            }
          }
        }

        // Manual luôn là off
        if (payload.value.create_campaign === CREATE_CAMP.MANUAL) {
          payload.value.landing_page_by_creative = ONOFF.OFF
        }

        //Nếu on thì set landing rỗng cho chắc
        if (payload.value.landing_page_by_creative === ONOFF.ON) {
          payload.value.landing_pages = { id: 0 }
        }

        if (window.arb.debug) {
          console.log('payload.value', payload.value)
          return
        }
        const result = await ctr_campaign.AddCampaign(payload.value)

        if (result?.status) {
          window.message.success(`Submit success!`)
          storage.remove()

          if (feSettings.value?.page_list) {
            window.router.push({ path: feSettings.value?.page_list })
          }
        }
      }

      //Fix cứng tạm đoạn này sửa sớm
      if (
        FreezeData.isDuplicatePage() &&
        window.arb.isPub() &&
        payload.value.traffic_source === TS.FACEBOOK
      ) {
        payload.value.duplicate_type = DUPLICATE_TYPE.DUPLICATE
      }

      if (FreezeData.isEditPage()) {
        if (window.arb.debug) {
          console.log('payload.value', payload.value)
          return
        }
        const result = await ctr_campaign.EditCampaign(payload.value)

        if (result?.status) {
          // Re-fetch by ID after editing
          if (getById) {
            await fetchCampaignGetById(payload.value.traffic_source, false)
            fixDataHandle(campaign)
          }
          window.message.success(`Edit success!`)
        }
      }
    } finally {
      statusData.value.isSubmitBtnLoading = false
    }
  }

  interface StorageType {
    campaign: campaignTypeClass
    _isDefault: boolean
  }
  const onMountedHandle = async (fetchDuplicate: Function, ts?: string) => {
    if (FreezeData.isModeInvalid()) {
      window.message.error('Invalid mode!')
      return
    }
    try {
      switch (true) {
        case FreezeData.isAddPage():
          const data = storage.getData() as StorageType | any

          if (!data) {
            statusData.value.SetCampaignIsDefault(true)
            storage.initWatchV2(campaign, statusData)
            statusData.value.isLoading = false
            return
          }
          if (data) {
            if (!data._isDefault) {
              statusData.value.showModalSaveForm = true
            } else {
              statusData.value.isLoading = false
            }
            storage.initWatchV2(campaign, statusData)
          }
          return
        case FreezeData.isEditPage():
          await fetchCampaignGetById(ts)

          campaign.value.CheckNotFound()

          return
        case FreezeData.isDuplicatePage():
          await fetchDuplicate()

          campaign.value.CheckNotFound()
          return
      }
    } finally {
      fixDataHandle(campaign)
    }
  }

  return {
    deleteNullProp,
    beforeMountHandle,
    fetchPermission,
    fetchCampaignGetById,
    submitForm,
    onMountedHandle,
  }
}

export function campWatch() {
  const watchDisplayName = (
    displayName: Ref,
    FreezeData: FreezeClass,
    statusData: Ref<StatusCampManager>
  ) => {
    watch(
      () => displayName.value,
      () => {
        if (
          !FreezeData.isEditPage() ||
          statusData.value.isLoading ||
          !statusData.value.userClick
        ) {
          return
        }

        statusData.value.initName = false
      }
    )
  }

  return { watchDisplayName }
}
export function useTrackInput(callback: (el?: HTMLElement) => void) {
  let observer: MutationObserver | null = null

  const trigger = (el?: HTMLElement) => {
    callback(el)
  }

  const handleDomEvent = (e: Event) => {
    const target = e.target as HTMLElement
    if (
      target.matches('input, textarea, select, .n-input input') ||
      target.closest('.n-switch') ||
      target.closest('.n-radio') ||
      target.closest('.n-checkbox')
    ) {
      trigger(target)
    }
  }

  const handleBodyClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    // Người dùng chọn option hoặc item trong popup
    if (target.closest('.n-base-select-option')) {
      trigger(target)
    }
  }

  const setupMutationObserver = () => {
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes) as HTMLElement[]
          for (const node of addedNodes) {
            // Theo dõi khi Naive UI render popup select hoặc date-picker
            if (
              node.querySelector?.('.n-base-select-option') ||
              node.querySelector?.('.n-date') ||
              node.querySelector?.('.n-time') ||
              node.classList?.contains('n-base-select-option')
            ) {
              node.addEventListener('click', (e) => {
                const target = e.target as HTMLElement
                if (
                  target.closest('.n-base-select-option') ||
                  target.closest('.n-date') ||
                  target.closest('.n-time')
                ) {
                  trigger(target)
                }
              })
            }
          }
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  onMounted(async () => {
    await nextTick()
    document.body.addEventListener('input', handleDomEvent, true)
    document.body.addEventListener('change', handleDomEvent, true)
    document.body.addEventListener('click', handleBodyClick, true)
    setupMutationObserver()
  })

  onBeforeUnmount(() => {
    document.body.removeEventListener('input', handleDomEvent, true)
    document.body.removeEventListener('change', handleDomEvent, true)
    document.body.removeEventListener('click', handleBodyClick, true)
    observer?.disconnect()
    observer = null
  })
}

// export function useTrackInput(callback: (el?: HTMLElement) => void) {
//   const listenerRefs: Array<{ el: HTMLElement; fn: (e: Event) => void }> = []

//   const trigger = (el?: HTMLElement) => {
//     el?.classList.add('changed')
//     callback(el)
//   }

//   const globalClickHandler = (e: Event) => {
//     const target = e.target as HTMLElement

//     if (
//       target.closest('.n-base-select-option') || // chọn option trong dropdown
//       target.closest('.n-radio') ||
//       target.closest('.n-checkbox') ||
//       target.closest('.n-switch')
//     ) {
//       trigger(target)
//     }
//   }

//   onMounted(async () => {
//     await nextTick()

//     const inputs = document.querySelectorAll<HTMLElement>(
//       'input, textarea, select, .n-input input'
//     )

//     inputs.forEach((el) => {
//       const handler = (e: Event) => {
//         trigger(el)
//       }

//       el.addEventListener('input', handler)
//       el.addEventListener('change', handler)
//       listenerRefs.push({ el, fn: handler })
//     })

//     document.body.addEventListener('click', globalClickHandler)
//   })

//   onBeforeUnmount(() => {
//     listenerRefs.forEach(({ el, fn }) => {
//       el.removeEventListener('input', fn)
//       el.removeEventListener('change', fn)
//     })
//     document.body.removeEventListener('click', globalClickHandler)
//   })
// }

export function campComputed(
  campaign: Ref<campaignTypeClass>,
  FreezeData: FreezeClass,
  statusData: Ref<StatusCampManager>,
  displayName: Ref
) {
  const showName = computed(() => {
    if (FreezeData.isEditPage()) {
      if (statusData.value.initName) {
        return campaign.value?.name || ''
      }

      return displayName.value
    }

    return displayName.value
  })

  const payload = computed<any>(() => {
    let payload = helper.clone(campaign.value)

    if (payload.origin_name) {
      payload.name = showName.value
    }

    try {
      const unlockDialog = payload.ad_formats?.unlock_content?.dialog
      if (unlockDialog?.image) {
        const host = URL_UPLOAD
        if (unlockDialog.image.startsWith(host)) {
          unlockDialog.image = unlockDialog.image.replace(host, '')
        }
      }
    } catch {}

    // This feature currently supports Google and Facebook
    if (
      (campaign.value.IsTrafficGoogle() ||
        campaign.value.IsTrafficFacebook()) &&
      FreezeData.isDuplicatePage()
    ) {
      if (campaign.value.IsCloneCampaign()) {
        payload.clone_by_id =
          campaign.value.clone_by_id || FreezeData.duplicateId
      } else {
        payload.clone_by_id = undefined
        payload.url = undefined
      }
    }

    //Chặn cho chắc hiện tại code có trường hợp có categories mà adgroup vẫn chọn audience_type = advantage đc
    if (campaign.value.IsTrafficFacebook()) {
      if (campaign.value.categories?.length) {
        campaign.value.ad_groups?.forEach((adgroup) => {
          adgroup.audience_type = PLACEMENT_TYPE.MANUAL
        })
      }
    }

    if (campaign.value.IsTrafficPocPoc()) {
      switch (true) {
        case campaign.value.IsPlacementAdformat():
          payload.targeting_adformat = campaign.value.targeting as string[]
          break
        case campaign.value.IsPlacementActiveView():
          payload.targeting_active_view = campaign.value.targeting as string
          break
      }
    }

    if (campaign.value.IsTrafficTiktok()) {
      if (
        campaign.value.age_groups &&
        campaign.value.age_groups[0] === 'AGE_UNLIMITED'
      ) {
        campaign.value.age_groups = []
      }

      if (campaign.value.ad_groups?.length) {
        payload.ad_groups?.forEach((adgroup: any) => {
          const pixel = adgroup.pixel
          if (typeof pixel === 'string' && pixel.includes('_')) {
            adgroup.pixel = pixel.split('_')[0]
          }
        })
      }
    }

    //Db nhận dữ liệu là string
    if (campaign.value.IsTrafficFacebook() && campaign.value.IsAPI()) {
      if (campaign.value.ad_groups?.length) {
        payload.ad_groups?.forEach((adgroup: any) => {
          if (adgroup.schedule?.dayparting?.length) {
            adgroup.schedule.dayparting = adgroup.schedule?.dayparting.join('')
          }

          //Default là all
          if (!adgroup.language?.length) {
            adgroup.language = ['ALL']
          }
        })
      }
    }

    if (campaign.value.IsTrafficNewsbreak()) {
      if (campaign.value.ad_groups?.length) {
        payload.ad_groups?.forEach((adgroup: any) => {
          if (adgroup.schedule?.dayparting) {
            // Chuyển object dayparting thành JSON string
            adgroup.schedule.dayparting = JSON.stringify(
              adgroup.schedule.dayparting
            )
          }

          //Default là all
          if (!adgroup.language?.length) {
            adgroup.language = ['ALL']
          }
        })
      }
    }

    if (
      payload.keyword_campaign_ai &&
      helper.IsString(payload.keyword_campaign_ai)
    ) {
      payload.keyword_campaign_ai = helper.stringToArray(
        payload.keyword_campaign_ai
      )
    }

    return payload
  })

  return {
    showName,
    payload,
  }
}

export async function addDemoData(
  campaign: Ref<campaignTypeClass>,
  statusData: Ref<StatusCampManager>,
  campaignDev: campaignTypeClass
) {
  statusData.value.isLoading = true

  const result = await ctr_campaign.DevDemoData(campaignDev)

  if (result?.data) {
    campaign.value = new campaignTypeClass(result?.data)
  }

  await helper.sleep(0)
  statusData.value.isLoading = false
}
