import {
  defaultSchedule,
  campaignTypeClass,
} from '@/types/components/campaign-v2'
import { ValDayparting } from '@/constants/campaign'

//Init ra các trường ko lưu db cho đúng hiển thị mỗi khi onMounted
export function fixDataHandle(campaign: Ref<campaignTypeClass>) {
  if (
    campaign.value.keyword_campaign_ai &&
    Array.isArray(campaign.value.keyword_campaign_ai)
  ) {
    campaign.value.keyword_campaign_ai =
      campaign.value.keyword_campaign_ai?.join('\n')
  }

  switch (true) {
    //bidding_status trường này ko lưu db nên cần handle lại mỗi khi mounted
    case campaign.value.IsTrafficGoogle():
      if (campaign.value?.cpc && campaign.value.cpc > 0) {
        campaign.value.bidding_status = true
      }

      if (campaign.value.IsDemandGen() && campaign.value.ad_groups?.length) {
        campaign.value.ad_groups.forEach((adGroup) => {
          if (adGroup.cpc && adGroup.cpc > 0) {
            adGroup.bidding_status = true
          }
        })
      }

      break

    //bidding_strategy trường này ko lưu db nên cần handle lại mỗi khi mounted
    case campaign.value.IsTrafficTaboola():
      switch (campaign.value.bidding) {
        case 'OPTIMIZED_CONVERSIONS':
        case 'FIXED':
          campaign.value.bidding_strategy = 'CPC/CPM'
          break
        case 'MAX_CONVERSIONS':
        case 'TARGET_CPA':
        case 'CPC_CAP':
          campaign.value.bidding_strategy = 'CPA'
          break
      }

      if (campaign.value.schedule?.type === 'all') {
        campaign.value.schedule.value = defaultSchedule
      }
      break
    case campaign.value.IsTrafficSnapchat():
      if (!campaign.value.snapchat_audience) {
        campaign.value.snapchat_audience = {
          pre_audience: [],
          audience: [],
        }
      }
      break
    case campaign.value.IsTrafficPocPoc():
      switch (true) {
        case campaign.value.IsPlacementAdformat():
          campaign.value.targeting = campaign.value
            .targeting_adformat as string[]
          break
        case campaign.value.IsPlacementActiveView():
          campaign.value.targeting = campaign.value
            .targeting_active_view as string
          break
      }
      break

    case campaign.value.IsTrafficTiktok():
      if (campaign.value.schedule?.type === 'all') {
        campaign.value.schedule.dayparting = ValDayparting
      }
      if (campaign.value.ad_groups && campaign.value.ad_groups.length > 0) {
        campaign.value.tiktok_pixel = campaign.value.ad_groups[0].tiktok_pixel
        campaign.value.optimization_event =
          campaign.value.ad_groups[0].optimization_event
      }
      break

    case campaign.value.IsTrafficFacebook():
      //Data cũ ko có timezone cần gắn vào để VueDatePicker hiển thị đúng
      campaign.value.ad_groups?.forEach((ad_group) => {
        if (ad_group.start_date && !ad_group.start_date?.includes('UTC'))
          ad_group.start_date += ' UTC'
        if (ad_group.end_date && !ad_group.end_date?.includes('UTC'))
          ad_group.end_date += ' UTC'

        if (!ad_group.schedule) {
          ad_group.schedule = {}
        }
        if (ad_group.schedule.time_zone_type) {
          ad_group.schedule.show_dayparting = true
        }

        //Vì lưu db là string, cần handle lại ra array
        if (
          ad_group.schedule.dayparting &&
          helper.IsString(ad_group.schedule.dayparting) &&
          typeof ad_group.schedule.dayparting === 'string' &&
          !Array.isArray(ad_group.schedule.dayparting)
        ) {
          ad_group.schedule.dayparting = ad_group.schedule.dayparting.split('')
        }

        if (!ad_group.cost_per_result) {
          ad_group.cost_per_result = undefined
        }
      })
      break

    case campaign.value.IsTrafficNewsbreak():
      campaign.value.ad_groups?.forEach((adgroup: any) => {
        if (adgroup.schedule?.dayparting) {
          try {
            // parse nhiều lớp escape
            let parsed = adgroup.schedule.dayparting
            while (typeof parsed === 'string') {
              parsed = JSON.parse(parsed)
            }
            adgroup.schedule.dayparting = parsed
          } catch (e) {
            console.error(
              'Parse dayparting failed:',
              e,
              adgroup.schedule.dayparting
            )
          }
        }
      })
      break

    case campaign.value.IsTrafficSmartNews():
      break
    default:
      break
  }
}
