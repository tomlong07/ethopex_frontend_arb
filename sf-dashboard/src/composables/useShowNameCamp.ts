import { URL_UPLOAD } from '@/constants/urls'
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

export function useShowNameCamp(
  campaign: Ref<campaignTypeClass>,
  FreezeData: ComputedRef<FreezeClass>,
  statusData: Ref<StatusCampManager>
) {
  const locationNamesTT = computed(() => {
    const adGroups = campaign.value.ad_groups ?? []
    if (adGroups?.some((adGroup) => adGroup.location?.value?.includes('ALL'))) {
      return ['All Countries']
    }

    const matchingLocationCodes = adGroups?.flatMap(
      (adGroup) =>
        adGroup.location?.value?.flatMap((location: string) =>
          statusData.value.optionsLocationTT
            .filter((item: any) => item.value === location)
            .map((item: any) => item.code)
        ) || []
    )

    const hasMore = matchingLocationCodes.length > 5
    const locations = [...new Set(matchingLocationCodes)]
    const name = locations.slice(0, 5).join(', ') + (hasMore ? '...' : '')

    return name ? [name] : []
  })

  const languageName = computed(() => {
    if (
      campaign.value.ad_groups?.some((adGroup) =>
        adGroup.language?.includes('ALL')
      )
    ) {
      return ['All Languages']
    }

    const allLanguages = campaign.value.ad_groups?.flatMap(
      (adGroup) => adGroup.language || []
    )
    const uniqueLanguages = [...new Set(allLanguages)]

    if (uniqueLanguages.length === 0) {
      return []
    }

    const hasMore = uniqueLanguages.length > 5
    const name = uniqueLanguages.slice(0, 5).join(', ') + (hasMore ? '...' : '')

    return [name]
  })

  type TrafficSource = 'tiktok'

  const displayName = computed(() => {
    if (statusData.value.isLoading) {
      return ''
    }
    if (!campaign.value?.traffic_source) {
      return ''
    }
    const trafficSource =
      campaign.value.traffic_source.toLowerCase() as TrafficSource

    const partMap: Record<TrafficSource, any[]> = {
      tiktok: [
        {
          condition: campaign.value.ad_groups?.length,
          value: locationNamesTT.value,
        },
        {
          condition: campaign.value.demand_source,
          value: statusData.value.demandSourceName,
        },
        {
          condition: campaign.value.ad_groups?.length,
          value: languageName.value,
        },
        {
          condition: campaign.value.origin_name,
          value: campaign.value.origin_name,
        },
      ],
    }
    return builNameDisplay(partMap[trafficSource])
  })

  const builNameDisplay = (part?: { condition: any; value: any }[]) => {
    let result =
      (campaign.value?.id ? `${campaign.value?.id}: ` : '') +
      `${helper.capitalizeFirstLetter(campaign.value.traffic_source)} -> `

    const nameArr: string[] = []

    part?.forEach((item) => {
      if (item.condition) {
        if (Array.isArray(item.value)) {
          nameArr.push(item.value.join(', '))
        } else {
          nameArr.push(item.value)
        }
      }
    })

    result += nameArr.join(' - ')

    return result
  }

  const showName = computed(() => {
    if (FreezeData.value.isEditPage()) {
      console.log(12)

      if (statusData.value.initName) {
        return campaign.value?.name || ''
      }
      return displayName.value
    }

    return displayName.value
  })

  const payload = computed<any>(() => {
    let payload = helper.clone(campaign.value)
    if (!payload.filters) {
      payload.filters = {}
    }

    if (!payload.filters.country?.values?.length) {
      payload.filters.country = {
        values: ['ALL'],
        operator: payload.filters.country?.operator,
      }
    }

    if (!payload.filters.device?.values?.length) {
      payload.filters.device = {
        values: ['ALL'],
        operator: payload.filters.device?.operator,
      }
    }

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
      (campaign.value?.IsTrafficGoogle() ||
        campaign.value?.IsTrafficFacebook()) &&
      FreezeData.value.isDuplicatePage()
    ) {
      if (campaign.value.IsCloneCampaign()) {
        payload.clone_by_id =
          campaign.value.clone_by_id || FreezeData.value.duplicateId
      } else {
        payload.clone_by_id = undefined
        payload.url = undefined
      }
    }

    if (campaign.value?.IsTrafficPocPoc()) {
      switch (true) {
        case campaign.value.IsPlacementAdformat():
          payload.targeting_adformat = campaign.value.targeting as string[]
          break
        case campaign.value.IsPlacementActiveView():
          payload.targeting_active_view = campaign.value.targeting as string
          break
      }
    }

    if (campaign.value?.IsTrafficTiktok()) {
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
    if (campaign.value?.IsTrafficFacebook() && campaign.value.IsAPI()) {
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

    if (campaign.value?.IsTrafficNewsbreak()) {
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

  return { showName, payload, displayName }
}
