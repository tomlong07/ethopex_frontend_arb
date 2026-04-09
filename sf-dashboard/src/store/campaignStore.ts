import {
  campaignTypeClass,
  FreezeClass,
  isDefaultZero,
  newCampaignClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { defineStore } from 'pinia'
import { DS, ONOFF, TS } from '@/enum/campaign'
import { useFeSettings } from '@/composables/feSettings'
import storage from '@/plugins/storage'
import { ctr_campaign } from '@/services/ctr_campaign'
import { fixDataHandle } from '@/components/campaign/help/FixData'
import { useShowNameCamp } from '@/composables/useShowNameCamp'

interface StorageType {
  campaign: campaignTypeClass
  _isDefault: boolean
}
export const useCampaignStore = defineStore('useCampaignStore', () => {
  const statusData = ref<StatusCampManager>(new StatusCampManager())
  const FreezeData = computed(() => {
    return helper.deepFreeze(new FreezeClass(window.route))
  })

  const traffic_source = ref<string>('')
  const campaign = ref<campaignTypeClass>(new campaignTypeClass({}))

  const feSettings = toRef(statusData.value, 'feSettings')

  useFeSettings(feSettings, window.route?.meta?.url as string)

  const { displayName, showName, payload } = useShowNameCamp(
    campaign,
    FreezeData,
    statusData
  )

  watch(
    () => FreezeData.value.isAddPage(),
    (newMode, _) => {
      if (newMode) {
        nextTick(() => {
          campaign.value = newCampaignClass(traffic_source.value as TS)
        })
      }
    }
  )

  const beforeMountHandle = () => {
    // if (FreezeData.isAddPage()) {
    //   storage.initWatchV2(campaign, statusData)
    // }

    if (FreezeData.value.isEditPage()) {
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

  const fetchDuplicate = async () => {
    statusData.value.isLoading = true

    const result = await ctr_campaign.Duplicate(FreezeData.value.duplicateId)

    if (result?.status) {
      campaign.value = new campaignTypeClass(result?.data || {})

      // campaign.value = new campaignTypeClass(campData.data || {})
      copyHandle()
    }
    campaign.value?.HandleDuplicate()

    statusData.value.isLoading = false
  }

  //Repair data for duplicate from other traffic source
  const copyHandle = async () => {
    if (!FreezeData.value.isCopy) {
      return
    }
  }

  const onMountedHandle = async (ts?: string) => {
    if (FreezeData.value.isModeInvalid()) {
      window.message.error('Invalid mode!')
      return
    }
    try {
      switch (true) {
        case FreezeData.value.isAddPage():
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
        case FreezeData.value.isEditPage():
          await fetchCampaignGetById(ts)

          campaign.value?.CheckNotFound()

          return
        case FreezeData.value.isDuplicatePage():
          await fetchDuplicate()

          campaign.value?.CheckNotFound()
          return
      }
    } finally {
      fixDataHandle(campaign as Ref<campaignTypeClass>)
    }
  }

  const fetchCampaignGetById = async (ts?: string, loading: boolean = true) => {
    if (loading) {
      statusData.value.isLoading = true
    }

    const campResult = await ctr_campaign.GetByID(FreezeData.value.id)
    // const campResult = camp_fb

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
        campaign.value.IsTrafficGoogle() &&
        campaign.value.IsAPI() &&
        campaign.value.ad_groups
      ) {
        //Xóa hết các creative của adgroup để ko select vào -> tạo sai
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
            path: `/${urlRedirect}/${campaign.value?.traffic_source}/${FreezeData.value.id}`,
          })
          return
        }
      }
    }

    statusData.value.isLoading = false
  }

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

  const submitForm = async (getById?: string) => {
    try {
      statusData.value.isSubmitBtnLoading = true
      if (FreezeData.value.isAddPage() || FreezeData.value.isDuplicatePage()) {
        if (payload.value.demand_source === DS.PUBPOWER) {
          payload.value.landing_page_by_creative = ONOFF.OFF //Off cho chắc sợ handle thiếu chỗ nào đó
        } else {
          //Lead đc phép tắt
          if (!window.arb.isLead() && payload.value.prelanding === ONOFF.OFF) {
            payload.value.landing_page_by_creative = ONOFF.ON //On cho chắc sợ handle thiếu chỗ nào đó
          }
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

      if (FreezeData.value.isEditPage()) {
        const result = await ctr_campaign.EditCampaign(payload.value)

        if (result?.status) {
          // Re-fetch by ID after editing
          if (getById) {
            await fetchCampaignGetById(payload.value.traffic_source, false)
            fixDataHandle(campaign as Ref<campaignTypeClass>)
          }
          window.message.success(`Edit success!`)
        }
      }
    } finally {
      statusData.value.isSubmitBtnLoading = false
    }
  }

  const initCampaign = async (ts: TS) => {
    traffic_source.value = ts

    campaign.value = FreezeData.value.isAddPage()
      ? newCampaignClass(ts)
      : new campaignTypeClass({})
  }

  return {
    FreezeData,
    campaign,
    feSettings,
    statusData,
    displayName,
    showName,

    initCampaign,
    beforeMountHandle,
    fetchPermission,
    onMountedHandle,
    submitForm,
    // setDemandSourceName,
  }
})
