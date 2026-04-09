import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

export const useCampaignName = (
  campaign: Ref<campaignTypeClass | undefined>,
  statusData: any,
  demandSourceName: Ref<string>
) => {
  const getLocationNames = (adGroups: any[]) => {
    if (adGroups.some((adGroup) => adGroup.location?.value?.includes('ALL'))) {
      return ['All Countries']
    }

    const matchingLocationCodes = adGroups.flatMap(
      (adGroup) =>
        adGroup.location?.value?.flatMap((location: string) =>
          statusData.optionsLocationTT
            .filter((item: any) => item.value === location)
            .map((item: any) => item.code)
        ) || []
    )

    const hasMore = matchingLocationCodes.length > 5
    const locations = [...new Set(matchingLocationCodes)]
    const name = locations.slice(0, 5).join(', ') + (hasMore ? '...' : '')

    return name ? [name] : []
  }

  const getLanguageNames = (adGroups: any[]) => {
    if (adGroups.some((adGroup) => adGroup.language?.includes('ALL'))) {
      return ['All Languages']
    }

    const allLanguages = adGroups.flatMap((adGroup) => adGroup.language || [])
    const uniqueLanguages = [...new Set(allLanguages)]

    if (uniqueLanguages.length === 0) {
      return []
    }

    const hasMore = uniqueLanguages.length > 5
    const name = uniqueLanguages.slice(0, 5).join(', ') + (hasMore ? '...' : '')

    return [name]
  }

  const displayName = computed(() => {
    if (!campaign.value?.traffic_source) {
      return ''
    }

    let result =
      (campaign.value?.id ? `${campaign.value?.id}: ` : '') +
      `${helper.capitalizeFirstLetter(campaign.value.traffic_source)} -> `

    const nameArr: string[] = []

    if (campaign.value.ad_groups?.length) {
      nameArr.push(...getLocationNames(campaign.value.ad_groups))
    }

    if (campaign.value.demand_source && demandSourceName.value) {
      nameArr.push(demandSourceName.value)
    }

    if (campaign.value.ad_groups?.length) {
      nameArr.push(...getLanguageNames(campaign.value.ad_groups))
    }

    if (campaign.value?.origin_name) {
      nameArr.push(campaign.value.origin_name)
    }

    if (nameArr.length) {
      result += nameArr.join(' - ')
    }

    return result || ''
  })

  const showName = computed(() => {
    const FreezeData = helper.deepFreeze(new FreezeClass(window.route))

    if (FreezeData.isEditPage()) {
      if (statusData.initName) {
        return campaign.value?.name || ''
      }
      return displayName.value
    }

    return displayName.value
  })

  return {
    displayName,
    showName,
  }
}
