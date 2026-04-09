import { RouteLocationNormalizedLoaded } from 'vue-router/dist/vue-router'
import {
  RemoveKeySingleImage,
  RemoveKeySingleVideo,
  ValDayparting,
} from '@/constants/campaign'
import { SelectOption } from 'naive-ui'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'

import {
  DS,
  ONOFF,
  PLACEMENT_FB_POSITION,
  PLACEMENT_INS_POSITION,
  PLACEMENT_MESSENGER_POSITION,
  PLACEMENT_NETWORK_POSITION,
  PLACEMENT_PLATFORM,
  PLACEMENT_TYPE,
  BIDSTRATEGY,
  AD_SETUP,
  TIME_ZONE_TYPE,
  CONVERSION_LOGIC,
  AI_STATUS,
  PLACEMENT_THREAD,
  ATTRIBUTION_SETTING,
  PLACEMENT_TYPE_TIKTOK,
  DUPLICATE_TYPE,
  TS,
  CREATE_CAMP,
  CAMP_TYPE,
  BIDDING_STRATEGY,
  // DEVICE,
} from '@/enum/campaign'

import { fetchCreativeNew } from '@/components/campaign/modules/Creative'
import { PermissionManager } from './base'
import { AdFormats } from './dialog'
import date2 from '@/utils/date2'
import { FeSettings } from '@/class/fe_settings'
import { ScheduleEntry } from '@/interface/campaign'
import { ENROLL_STATUS } from '@/enum/creative'
import { CDN_IMAGE } from '@/constants/urls'
import { PurchaseValue } from '@/class/campaign'

export const campaignType = [
  { label: 'Google Search', value: CAMP_TYPE.GGSEARCH },
  { label: 'Demand Gen', value: CAMP_TYPE.DEMANDGEN },
  { label: 'Performance Max', value: CAMP_TYPE.PERFORMANCEMAX },
  { label: 'Google Display', value: CAMP_TYPE.GGDISPLAY },
]

export const isDefaultZero = (key: string) => {
  return ['label'].includes(key)
}

export const typeObjectOptionsFB: SelectOption[] = [
  { value: 'BRAND_AWARENESS', label: 'Awareness', disabled: true },
  { value: 'OUTCOME_TRAFFIC', label: 'Traffic', disabled: true },
  { value: 'OUTCOME_ENGAGEMENT', label: 'Engagement', disabled: true },
  { value: 'OUTCOME_LEADS', label: 'Leads' }, //open Leads Thu 29/05/25
  { value: 'OUTCOME_APP_PROMOTION', label: 'App promotion', disabled: true },
  { value: 'OUTCOME_SALES', label: 'Sales' },
]

export const CampaignSetupFBSale: SelectOption[] = [
  {
    value: 'advantage',
    label: 'Advantage+ shopping campaign',
    info: 'Maximize performance and reach valuable audiences with a simplified setup. Preset settings include placements, age and more.',
    img: `${CDN_IMAGE}/s3-pw/arb/images/464956518_1337173443932548_6885153174923355845_n.png`,
  },
  {
    value: 'manual',
    label: 'Manual sales campaign',
    info: 'Create a sales campaign from scratch using the standard setup.',
    icon: true,
  },
]
interface inventory {
  inventory: string
  id: number
  type: string
}
export interface SnapchatAudience {
  pre_audience: string[]
  audience: number[]
}

export interface scheduleItem {
  type: string
  day: string
  from_hour: number
  until_hour: number
}
export interface keywordLanding {
  keyword: string
  landing_page_id: number | null
  keyword_prelander: string
  domain_prelander: string | null
  status_prelander: ONOFF
}

interface UserInfo {
  id: number
  email: string
}

interface MenuCampaignFB {
  adGroup?: boolean
  creative?: boolean
  campaign?: boolean
  source?: string // đánh dấu xem là mảng nào
}
interface IndexTabCampaignFB {
  adGroupIndex?: number
  creativeIndex?: number
}

export class StatusCampManager {
  disabledSubmit: boolean | undefined
  _isDefault: boolean
  isLoading: boolean
  isSubmitBtnLoading: boolean
  initName: boolean
  userClick: boolean
  showModalSaveForm: boolean
  initCreative: number
  showModalAdGroup: boolean
  showModalAdsInfo: boolean
  valueToCodeMap?: Record<string, string>

  changeAdGroup: number

  loadingPixel: number = 0 //Sử dụng để đảm bảo load pixel sau khi load accountOptions vì khi có mới có value của account
  accountOptions: SelectOption[] = []

  permission: PermissionManager

  readyWatch: boolean = false //Cho phép watch

  isTabCampaign: boolean
  isTabAdGroup: boolean
  isTabCreative: boolean
  source?: string
  adGroupIndex: number | undefined
  creativeIndex: number | undefined
  showActionButton: boolean
  actionButtonEnabled: boolean // biến này chỉ để đánh dấu thay đổi
  isFirstKey: boolean
  isLastKey: boolean

  feSettings: FeSettings
  pixelsTemp: string[]
  optionsLocationTT: SelectOption[]

  demandSourceName: string

  constructor() {
    this.isLoading = true
    this.isSubmitBtnLoading = false
    this.initName = true
    this.userClick = false
    this.showModalSaveForm = false
    this.initCreative = 0
    this.showModalAdGroup = false
    this.showModalAdsInfo = false
    this._isDefault = false
    this.changeAdGroup = 0
    this.permission = {}

    this.isTabCampaign = true
    this.isTabAdGroup = false
    this.isTabCreative = false
    this.source = undefined
    this.adGroupIndex = undefined
    this.creativeIndex = undefined
    this.showActionButton = false
    this.actionButtonEnabled = false
    this.isFirstKey = false
    this.isLastKey = false

    this.feSettings = new FeSettings()
    this.pixelsTemp = []
    this.optionsLocationTT = []

    this.demandSourceName = ''
  }

  // Logic cho accountSelected
  getAccountSelected(account_supply_id: any): any {
    for (let index = 0; index < this.accountOptions.length; index++) {
      const element = this.accountOptions[index]
      if (element.id == account_supply_id) {
        return element
      }
    }
    return {}
  }

  // Logic cho accountCategoryIdNow
  getAccountCategoryIdNow(account_supply_id: any): string {
    const selected = this.getAccountSelected(account_supply_id)
    if (helper.isEmpty(selected) || selected.value == null) {
      return ''
    }
    return selected.value.toString()
  }

  refreshCreative() {
    this.initCreative = Date.now()
  }

  isAcceptAPI() {
    return this.permission.create_campaign?.api === true
  }
  isAcceptManual() {
    return this.permission.create_campaign?.manual === true
  }

  isAcceptAI() {
    return this.permission.create_campaign?.ai === true
  }

  setOnTab(value: MenuCampaignFB) {
    this.isTabAdGroup = false
    this.isTabCampaign = false
    this.isTabCreative = false
    this.source = undefined

    if (value.adGroup) {
      this.isTabAdGroup = true
    } else if (value.campaign) {
      this.isTabCampaign = true
    } else if (value.creative) {
      this.isTabCreative = true
    }

    this.source = value.source
  }

  setIndexTab(value: IndexTabCampaignFB) {
    if (value.adGroupIndex != null) {
      this.adGroupIndex = value.adGroupIndex
    }
    if (value.creativeIndex != null) {
      this.creativeIndex = value.creativeIndex
    }
  }

  IsTabCampaign() {
    return this.isTabCampaign === true
  }
  IsTabAdGroup() {
    return this.isTabAdGroup === true
  }
  IsTabCreative() {
    return this.isTabCreative === true
  }
  SetActionButtonEnabled(value: boolean) {
    this.actionButtonEnabled = value
  }
  SetShowActionButton(value: boolean) {
    this.showActionButton = value
  }
  SetFirstKey(value: boolean) {
    this.isFirstKey = value
  }
  SetLastKey(value: boolean) {
    this.isLastKey = value
  }
  IsShowActionButton() {
    return this.showActionButton
  }
  IsActionButtonEnabled() {
    return this.actionButtonEnabled
  }

  IsFirstKey() {
    return this.isFirstKey
  }
  IsLastKey() {
    return this.isLastKey
  }
  SetCampaignIsDefault(value: boolean) {
    this._isDefault = value
  }
}

export class FreezeClass {
  id: number
  duplicateId: number
  isCopy: boolean
  duplicate_type: DUPLICATE_TYPE

  constructor(route: RouteLocationNormalizedLoaded) {
    this.id = Number(route?.params?.id) || 0
    this.duplicateId = Number(route?.query?.duplicate) || 0
    this.isCopy = Boolean((route?.query?.copy as string) === 'true') || false
    this.duplicate_type = (route?.query?.mode as DUPLICATE_TYPE) || ''
  }

  isDuplicatePage() {
    return this.duplicateId !== 0
  }

  isDuplicatePageV2() {
    return this.isDuplicatePage() && this.ModeInvalid()
  }

  isAddPage() {
    return this.id === 0 && !this.isDuplicatePage()
  }

  isEditPage() {
    return this.id !== 0 && !this.isDuplicatePage()
  }

  ModeInvalid() {
    return [
      DUPLICATE_TYPE.DUPLICATE,
      DUPLICATE_TYPE.DUPLICATE_KEEP_LINK,
      DUPLICATE_TYPE.BOT,
    ].includes(this.duplicate_type)
  }

  isModeInvalid() {
    return (this.duplicate_type as string) !== '' && !this.ModeInvalid()
  }

  isAddorDuplicate() {
    return this.isAddPage() || this.isDuplicatePage()
  }

  isClonePage(data: campaignTypeClass) {
    return data?.clone_by_id && this.isEditPage() ? true : false
  }
}

export const defaultSchedule: scheduleItem[] = [
  {
    type: 'INCLUDE',
    day: 'MONDAY',
    from_hour: 0,
    until_hour: 24,
  },
  {
    type: 'INCLUDE',
    day: 'TUESDAY',
    from_hour: 0,
    until_hour: 24,
  },
  {
    type: 'INCLUDE',
    day: 'WEDNESDAY',
    from_hour: 0,
    until_hour: 24,
  },
  {
    type: 'INCLUDE',
    day: 'THURSDAY',
    from_hour: 0,
    until_hour: 24,
  },
  {
    type: 'INCLUDE',
    day: 'FRIDAY',
    from_hour: 0,
    until_hour: 24,
  },
  {
    type: 'INCLUDE',
    day: 'SATURDAY',
    from_hour: 0,
    until_hour: 24,
  },
  {
    type: 'INCLUDE',
    day: 'SUNDAY',
    from_hour: 0,
    until_hour: 24,
  },
]

export interface adGroups {
  recommendations?: string[]
  ad_creative?: any[]
  ad_group_id?: string
  budget?: number | null
  cpc?: number | null
  id?: number | null
  status?: string
  tiktok_pixel?: number | null
  optimization_event?: string | null
  listPlacements?: string[]
  name?: string
  creative_id?: number

  // creative_ids?: number[];
  device?: string[]
  delivery_status?: string
  delivery_status_reasons?: string
  audience?: number | null
  ads?: any

  keyword_plan?: string
  keywords_gg_search?: string
  search_themes?: string[]
  location?: {
    value?: string[]
    type?: string
  }

  language?: string[]
  bidding_status?: boolean
  bidding?: string | null

  conversion_location?: string
  conversion_event?: string | null
  performance_goal?: string
  pixel?: string | null
  start_date?: string | null
  end_date?: string | null

  creatives?: creativeStruct[] | null

  gender?: string
  age_groups?: string[]
  ad_setup?: string
  click_through?: number
  engaged_view?: number
  view_through?: number

  bid_strategy?: BIDSTRATEGY | null
  cost_per_result?: number | null
  target_roas?: number
  url_parameters?: string
  interest?: Interest[]
  audience_type?: PLACEMENT_TYPE
  placement_type?: string
  placements?: string[]
  placement_platform?: PLACEMENT_PLATFORM[]
  facebook_positions?: PLACEMENT_FB_POSITION[]
  instagram_positions?: PLACEMENT_INS_POSITION[]
  messenger_positions?: PLACEMENT_MESSENGER_POSITION[]
  audience_network_positions?: PLACEMENT_NETWORK_POSITION[]
  threads_positions?: PLACEMENT_THREAD[]
  error?: string

  beneficiary?: string
  is_disabled?: boolean
  attribution?: ATTRIBUTION_SETTING

  schedule?: {
    dayparting?: string | string[] | null | Dayparting
    show_dayparting?: boolean //Giao diện
    time_zone_type?: TIME_ZONE_TYPE
    type?: string
    //value for taboola
    value?: scheduleItem[]
    //for tiktok
  }

  creative?: {
    id?: number | null
    ads?: number
    name?: string
    type?: string
  }

  ads_campaign?: number | null
  ads_adgroup?: number | null
  optimization_goal?: string
  categories?: string[]
  delivery_type?: string
  share_disabled?: boolean
  comment_disabled?: boolean
  budget_optimize_on?: string
  video_download_disabled?: boolean
  frequency_caps?: FrequencyCaps[]

  category_site_builder?: ONOFF | null
  category_site_builder_id?: number | null
  budget_type?: string | null
}
type Dayparting = Record<string, number[]>
export interface FrequencyCaps {
  impressions: number | null
  days: number | null
  time_unit: string | null
}
export interface Interest {
  id: string
  name: string
}

// Dạng cơ bản của từng creative feature
export interface BaseCreativeFeature {
  enroll_status: ENROLL_STATUS
}

export interface CreativeFeaturesSpec {
  // ====== TEXT & COMMENT FEATURES ======
  text_translation?: BaseCreativeFeature // Translate Text
  inline_comment?: BaseCreativeFeature // Relevant comments
  text_optimizations?: BaseCreativeFeature // Text improvements
  enhance_cta?: BaseCreativeFeature // Enhance CTA
  description_automation?: BaseCreativeFeature // Catalog dynamic description

  // ====== IMAGE FEATURES ======
  image_templates?: BaseCreativeFeature // Add overlays
  image_touchups?: BaseCreativeFeature // Visual touch-ups (image)
  image_brightness_and_contrast?: BaseCreativeFeature // Adjust brightness and contrast
  image_background_gen?: BaseCreativeFeature // Generate backgrounds
  image_uncrop?: BaseCreativeFeature // Expand image
  flex_media?: BaseCreativeFeature //test
  image_music?: BaseCreativeFeature //test
  image_animations?: BaseCreativeFeature //test
  // ====== VIDEO FEATURES ======
  video_auto_crop?: BaseCreativeFeature // Visual touch-ups (video)
  video_effects?: BaseCreativeFeature // test
  video_expand?: BaseCreativeFeature // test
  // ====== PLACEMENT & MEDIA FEATURES ======
  adapt_to_placement?: BaseCreativeFeature // Adapt to placement
  media_type_automation?: BaseCreativeFeature // Dynamic media
  product_extensions?: BaseCreativeFeature // Add catalog items
  add_text_overlay?: BaseCreativeFeature // Add Dynamic Overlays
  creative_stickers?: BaseCreativeFeature // Create sticker CTA
  reveal_details_over_time?: BaseCreativeFeature // Reveal details over time
  // ====== CAROUSEL ======
  profile_end_card?: BaseCreativeFeature //test
  dynamic_description?: BaseCreativeFeature //test
  highlight_carousel_card?: BaseCreativeFeature //test
  adapt_multi_image_format?: BaseCreativeFeature //test
}

export interface creativeStruct {
  creative_id?: number | null
  fanpage?: string | null
  post_id?: string | null
  landing_page_id?: number | null
  id?: number | null
  error?: string
  delivery_status?: string
  delivery_status_reasons?: string
  ad_setup?: AD_SETUP
  name?: string

  creative_features_spec?: CreativeFeaturesSpec
}
export interface Rewarded {
  headline?: string
  body?: string
  ad_option?: string
  ad_option_sub?: string
  thank_you?: string
}

export class AdFormatsRewarded {
  status: string
  floor_price: number
  dialog?: Rewarded

  constructor() {
    this.status = 'off'
    this.floor_price = 0
    this.dialog = {}
  }
}

export interface AdFormats_Camp {
  display: AdFormats
  anchor: AdFormats
  rewarded: AdFormatsRewarded
  interstitial: AdFormats
  unlock_content: AdFormats
}

export interface presetCampaign {
  name?: string
  default_preset?: ONOFF
  provider?: string
  ad_account?: string | null
  pixel?: string | null
  ad_account_name?: string
}

export interface presetLocation {
  name?: string
  locations?: string[]
  traffic_source?: string
}

export interface CampaignContext {
  campaign: campaignTypeClass
  statusData: StatusCampManager
  FreezeData: FreezeClass
  showName: string
}

export class campaignTypeClass {
  recommendations?: string[]
  campaign_preset?: presetCampaign

  location_preset?: presetLocation

  snap_pixel?: string | null
  conversion_event?: string
  ai_status?: AI_STATUS
  demand_source?: DS | null
  traffic_source?: TS
  account?: string
  delivery_status?: string
  delivery_status_reasons?: string
  id?: number
  account_supply_id?: number
  creative?: {
    id?: number | null
    ads?: number
    name?: string
    type?: string
  }
  gd?: string
  amxt?: string
  landing_pages?: {
    id?: number | null
    cvr?: number
    keywords?: string
    main_keyword?: string
    name?: string
    slug?: string
  }

  landing_page_ai?: {
    language?: string
    title?: string
    description?: string
  }

  prelander_landing?: number | null
  keyword_set_id?: number
  tags?: string[]
  filters?: {
    keyword?: {
      values?: string[]
      operator?: string
    }
    country?: {
      values?: string[]
      operator?: string
    }
    device?: {
      values?: string[]
      operator?: string
    }
    traffic_source?: {
      values?: string[]
      operator?: string
    }
  }
  start_date?: string
  end_date?: string

  optimize_with_AI_max?: string
  text_customization?: string
  final_url_expansion?: string
  //Old
  keywords?: string
  keyword_optimize?: boolean
  limit_page_view?: number
  keyword_ab_test?: boolean

  main_keyword?: string
  origin_name?: string
  status?: ONOFF
  prelanding?: ONOFF | null
  landing_page_by_creative?: ONOFF | null
  keyword_macro?: string
  prelanding_domain?: string | null
  direct_link?: ONOFF
  traffic_source_id?: string
  user_flow?: string
  vertical?: string
  create_campaign?: CREATE_CAMP
  keyword_campaign_ai?: string | string[]
  url?: string
  url_backup?: string
  link_ads?: string
  goals?: string
  label?: number

  pricingRule?: number
  ad_formats?: AdFormats_Camp
  secondary_keyword?: string
  bidding?: string | null
  budget_type?: string
  //Google
  campaign_type?: CAMP_TYPE
  search_network?: boolean
  display_network?: boolean
  broad_match_keyword?: string
  bidding_status?: boolean
  cpc?: number
  listPlacements?: string[]
  budget?: number
  location?: {
    value?: string[]
    type?: string
  }
  language?: string[]
  device?: string[]
  search_to_search?: ONOFF
  keyword_plan?: string
  keywords_gg_search?: string
  audience?: number | null
  operating_systems?: string[]
  conversion_goals?: string | null

  category_site_builder?: ONOFF | null
  category_site_builder_id?: number | null

  ad_top?: number | null
  ad_bottom?: number | null
  position_status?: 'on' | 'off'
  //Pubpower
  min_epc?: number | null
  conversion_logic?: CONVERSION_LOGIC | null

  //Taboola
  bidding_strategy?: string //Ko lưu nên cần repair lại
  ads_campaign?: number | null //Ko lưu nên cần repair lại
  ads_adgroup?: number //Ko lưu nên cần repair lại
  type?: string
  schedule?: {
    type?: string
    //value for taboola
    value?: scheduleItem[]
    //for tiktok
    dayparting?: string

    google?: ScheduleEntry[]
  }

  //Snapchat
  gender?: string
  age_groups?: string[]
  snapchat_audience?: SnapchatAudience

  // Mgid
  category_id_mgid?: number

  // Outbrain
  msn_exclusively?: ONOFF
  impact_placements?: ONOFF
  exclude_adblock?: ONOFF

  //Pocpoc
  placement?: string
  targeting?: string | string[]
  targeting_adformat?: string[]
  targeting_active_view?: string
  inventories?: inventory[]
  related_search_ad?: ONOFF
  keyword_manager?: {
    domain?: string
    keywords_campaign?: keywordLanding[]
  }

  //Tiktok
  is_multiple_creative?: boolean
  delivery_type?: string
  budget_optimize_on?: string
  tiktok_pixel?: number | null
  optimization_event?: string | null
  placement_type?: string
  placements?: string[]
  comment_disabled?: boolean
  video_download_disabled?: boolean
  share_disabled?: boolean
  ad_groups?: adGroups[]
  creative_type?: string
  optimization_goal?: string

  //facebook
  buying_type?: string
  categories?: string[]
  advantage_campaign_budget?: ONOFF
  campaign_setup?: string
  bid_strategy?: BIDSTRATEGY | null

  // Trả về từ get by id
  name?: string
  clone_by_id?: number
  pixels?: string[]
  triggers?: string[]
  user?: UserInfo | null
  ad_creative?: any[]
  create_error?: string

  purchase_value?: PurchaseValue

  duplicate_type?: DUPLICATE_TYPE
  // schedule?: ScheduleDaypartingGoogleWrapper

  constructor(data: any) {
    this.SetData(data)
  }

  SetData(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          switch (key) {
            case 'purchase_value':
              this.purchase_value = new PurchaseValue(element)
              break
            default:
              if (Array.isArray(this[key as keyof this]) && !element) {
                //để clear data hiển thị ở n-select, nếu undefined nó clear value nhưng hiển thị ko clear
                this[key as keyof this] = [] as any
                break
              }
              this[key as keyof this] = element
              break
          }
        }
      }
    }
    // Nếu có ad_groups và campaign_setup
    if (this.IsTrafficFacebook() && Array.isArray(this.ad_groups)) {
      this.ad_groups = this.ad_groups.map((adGroup: any) => ({
        ...adGroup,
        audience_type: adGroup.audience_type || PLACEMENT_TYPE.MANUAL,
        placement_type: adGroup.placement_type || PLACEMENT_TYPE.MANUAL,
      }))
    }
  }

  SetNewCampaign(ts: TS) {
    const value = newCampaignClass(ts)
    this.SetData(value)
  }

  CheckNotFound(): void {
    //Check cả 2 cho chắc vì trường hợp duplicate không có id
    if (!this?.id && !this.account_supply_id && !this.traffic_source) {
      window.arb.log.CampaignStatus()
    }
  }

  HasPostProgress() {
    return this.ad_groups?.some((group) =>
      group.creatives?.some(
        (e) => !e.post_id && e.delivery_status === 'pending' && e.error === ''
      )
    )
  }

  HandleDuplicate(): boolean | undefined {
    if (window.arb.isPub()) {
      this.landing_page_by_creative = ONOFF.ON
      this.landing_pages = {}
    }

    switch (true) {
      case this.IsTrafficFacebook() && this.IsAPI():
        try {
          //trường hợp ad ở camp gốc lỗi thì xóa bỏ và thông báo
          const hasError = this.ad_groups?.some((group) =>
            group.ad_creative?.some(
              (e) =>
                !e.post_id && e.delivery_status === 'pending' && e.error !== ''
            )
          )

          if (hasError) {
            window.message.warning(
              'Some ads contained errors and were automatically removed during duplication.'
            )
          }

          //Bê ad_creative vào draft creatives
          this.ad_groups = this.ad_groups?.map((element) => ({
            ...element,
            creatives: helper
              .clone(element.ad_creative)
              ?.filter((e: any) => !e.error)
              .map((e: any) => ({
                ...e,
                ...(e.post_id && { ad_setup: AD_SETUP.USE_EXISTING_POST }),
                creative_features_spec: !e.creative_features_spec
                  ? AddCreativeSingleImage(e.creative_features_spec, true)
                  : e.creative_features_spec,
                landing_page_id:
                  e.status_link === 'error' ? null : e.landing_page_id,
              })),
            ad_creative: undefined,
          }))

          if (this.HasPostProgress()) {
            window.message.warning(
              'Original campaign, ad groups and ads are being created. Please try again in a few minutes.'
            )

            //Vẫn cho submit mới bt, đội fb yêu cầu để duplicate các chỉ số khác, post chưa tạo xong có thể chọn post khác
            return
          }
        } catch (error) {
          console.error(error)
        }
        break

      case this.IsTrafficFacebook() && this.IsManual():
        try {
          this.ad_groups = []
        } catch (error) {
          console.error(error)
        }
        break

      case this.IsTrafficGoogle() && this.IsAPI():
        try {
          //Bê ad_creative vào draft creatives
          this.ad_groups = this.ad_groups?.map((element) => ({
            ...element,
            creatives: helper.clone(element.ad_creative)?.map((e: any) => ({
              ...e,
              creative_id: e.creative_id,
            })),
            ad_creative: undefined, // Xóa ad_creative
          }))

          if (this.creative?.id) {
            //3 case
            //1: camp cũ có mỗi data campaign -> duplicate sẽ tạo 1 adgroup theo data cũ
            //2: camp cũ có cả adgroup (add thêm) -> duplicate sẽ tạo adgroup theo data cũ append vào list adgroup
            //3: camp mới chỉ có adgroup -> duplicate sẽ tạo adgroup theo data list adgroup
            if (!this.ad_groups) this.ad_groups = []
            const newAdGroup: adGroups = {
              name: 'New AdGroup',
              creative_id: this.creative?.id,
            }

            if (this.keyword_plan) {
              newAdGroup.keyword_plan = this.keyword_plan
              this.keyword_plan = undefined
            }

            if (this.keywords_gg_search) {
              newAdGroup.keywords_gg_search = this.keywords_gg_search
              this.keywords_gg_search = undefined
            }

            if (this.audience) {
              newAdGroup.audience = this.audience
              this.audience = undefined
            }

            if (this.IsDemandGen()) {
              if (this.location?.value?.length) {
                newAdGroup.location = {
                  value: this.location?.value,
                  type: this.location?.type,
                }

                this.location = undefined
              }

              if (this.language?.length) {
                newAdGroup.language = helper.clone(this.language)
                this.language = undefined
              }
            }

            this.creative.id = undefined
          }
        } catch (error) {
          console.error(error)
        }
        break

      case this.IsTrafficTiktok() || this.IsTrafficNewsbreak():
        try {
          this.ad_groups = this.ad_groups?.map((element) => {
            const creatives = (helper.clone(element.ad_creative) ||
              []) as creativeStruct[]

            // lọc ra unique creative_id và giữ lại toàn bộ object
            const uniqueCreatives: creativeStruct[] = Array.from(
              new Map(
                creatives.map((e) => [e.creative_id, e]) // key = creative_id, value = object
              ).values()
            )

            return {
              ...element,
              creatives: uniqueCreatives,
              ad_creative: undefined, // Xóa ad_creative
            }
          })
        } catch (error) {
          console.error(error)
        }
        break

      case this.IsTrafficSnapchat():
        try {
          // Lấy creative_id đầu tiên từ ad_creative
          this.ad_groups = this.ad_groups?.map((element) => {
            const firstCreative = element.ad_creative?.[0]
            return {
              ...element,
              creatives: firstCreative
                ? [
                    {
                      ...firstCreative,
                      creative_id: firstCreative.creative_id,
                    },
                  ]
                : [],
              ad_creative: undefined, // Xóa ad_creative
            }
          })
        } catch (error) {
          console.error(error)
        }
        break
      default:
        break
    }

    return
  }

  IsTrafficFacebook(): boolean {
    return this?.traffic_source === TS.FACEBOOK
  }

  IsTrafficGoogle(): boolean {
    return this?.traffic_source === TS.GOOGLE
  }

  IsTrafficSnapchat(): boolean {
    return this?.traffic_source === TS.SNAPCHAT
  }

  IsTrafficMgId(): boolean {
    return this?.traffic_source === TS.MGID
  }

  IsTrafficPocPoc(): boolean {
    return this?.traffic_source === TS.POCPOC
  }

  IsTrafficTiktok(): boolean {
    return this?.traffic_source === TS.TIKTOK
  }

  IsTrafficTaboola(): boolean {
    return this?.traffic_source === TS.TABOOLA
  }

  IsTrafficQuantumdex(): boolean {
    return this?.traffic_source === TS.QUANTUMDEX
  }

  IsPrelandingOn(): boolean {
    return this.prelanding === ONOFF.ON
  }

  IsPrelandingOff(): boolean {
    return this.prelanding === ONOFF.OFF
  }

  IsTrafficNewsbreak(): boolean {
    return this?.traffic_source === TS.NEWSBREAK
  }

  IsTrafficOutBrain(): boolean {
    return this?.traffic_source === TS.OUTBRAIN
  }

  IsTrafficSmartNews(): boolean {
    return this?.traffic_source === TS.SMART_NEW
  }

  IsTrafficPinterest(): boolean {
    return this?.traffic_source === TS.PINTEREST
  }

  IsTrafficARBTraffic(): boolean {
    return this?.traffic_source === TS.ARB_TRAFFIC
  }

  IsHasPurchaseValue(): boolean {
    return (
      this.IsTrafficGoogle() ||
      this.IsTrafficFacebook() ||
      this.IsTrafficTiktok()
    )
  }

  //TS ít dùng
  IsRareTrafficSource(): boolean {
    return [
      TS.MGID,
      TS.POCPOC,
      TS.QUANTUMDEX,
      TS.REVCONTENT,
      TS.OUTBRAIN,
      TS.TABOOLA,
      TS.ZEMANTA,
      TS.MEDIAGO,
    ].includes(this?.traffic_source as TS)
  }

  IsSales(): boolean {
    return (
      this.IsTrafficFacebook() && this.IsAPI() && this?.type === 'OUTCOME_SALES'
    )
  }

  IsSalesAdvantage(): boolean {
    return this.IsSales() && this?.campaign_setup === 'advantage'
  }

  IsSalesManual(): boolean {
    return this.IsSales() && this?.campaign_setup === 'manual'
  }

  IsLeads(): boolean {
    return (
      this.IsTrafficFacebook() && this.IsAPI() && this?.type === 'OUTCOME_LEADS'
    )
  }

  IsDemandGen(): boolean {
    return (
      this.IsTrafficGoogle() &&
      this.IsAPI() &&
      this?.campaign_type === CAMP_TYPE.DEMANDGEN
    )
  }

  IsLabelAI(): boolean {
    return this.label === 34
  }
  IsPMax(): boolean {
    return (
      this.IsTrafficGoogle() &&
      this.IsAPI() &&
      this?.campaign_type === CAMP_TYPE.PERFORMANCEMAX
    )
  }

  IsGGDisplay(): boolean {
    return (
      this.IsTrafficGoogle() &&
      this.IsAPI() &&
      this?.campaign_type === CAMP_TYPE.GGDISPLAY
    )
  }

  IsManualCPC(): boolean {
    return this.IsGGDisplay() && this?.bidding === 'manual_cpc'
  }

  IsBidControl(): boolean {
    return (
      this.IsTrafficTaboola() &&
      this?.bidding_strategy === BIDDING_STRATEGY.BIDCONTROL
    )
  }

  IsMaxConversion(): boolean {
    return (
      this.IsTrafficTaboola() &&
      this?.bidding_strategy === BIDDING_STRATEGY.MAXCONVERSION
    )
  }

  IsManualReview(): boolean {
    return this.ai_status === AI_STATUS.MANUAL_REVIEW
  }

  IsHasMainKeyword(): boolean {
    if (!this?.demand_source) return false
    return [DS.SYSTEM1, DS.BING1, DS.BING2].includes(this?.demand_source as any)
  }

  IsHasSecondaryKeyword(): boolean {
    return this?.label === 18
  }

  IsOnSearch2Search(): boolean {
    return this?.search_to_search === ONOFF.ON
  }

  IsOffSearch2Search(): boolean {
    return this?.search_to_search === ONOFF.OFF
  }

  IsDirectOn(): boolean {
    return this?.direct_link === ONOFF.ON
  }

  IsDirectOff(): boolean {
    return this?.direct_link === ONOFF.OFF
  }

  IsHasKeywordSet(): boolean {
    if (this.IsOnSearch2Search()) return false
    if (this?.label === 24) return false

    return this.IsDemandAdsense()
  }

  IsDemandAdsense(): boolean {
    return this?.demand_source === DS.ADSENSE
  }

  IsDemandPubPower() {
    return this.demand_source === DS.PUBPOWER
  }

  IsDemandBing1() {
    return this.demand_source === DS.BING1
  }

  IsDemandBing2() {
    return this.demand_source === DS.BING2
  }

  IsDemandArbCore() {
    return this.demand_source === DS.ARBCORE
  }

  IsDemandCJ() {
    return this.demand_source === DS.CJ
  }

  IsPlacementAdformat(): boolean {
    return this.IsTrafficPocPoc() && this?.placement === 'adFormat'
  }

  IsShowTargeting(): boolean {
    return this.IsTrafficPocPoc() && this?.placement !== 'placement'
  }

  IsPlacementActiveView(): boolean {
    return this.IsTrafficPocPoc() && this?.placement === 'activeView'
  }

  IsAPI(): boolean {
    if (this.IsOnlyAPI()) return true

    return this?.create_campaign === CREATE_CAMP.API
  }

  IsManual(): boolean {
    return this?.create_campaign === CREATE_CAMP.MANUAL
  }

  IsAPIPublic(): boolean {
    return this?.create_campaign === CREATE_CAMP.API_PUBLIC
  }

  IsFBManual(): boolean {
    return this.IsTrafficFacebook() && this.IsManual()
  }

  IsFBHighestBid(): boolean {
    return (
      this.IsTrafficFacebook() &&
      this.IsAPI() &&
      this?.bid_strategy === BIDSTRATEGY.HIGHEST_VOLUME
    )
  }

  IsFBBidCap(): boolean {
    return (
      this.IsTrafficFacebook() &&
      this.IsAPI() &&
      this?.bid_strategy === BIDSTRATEGY.BID_CAP
    )
  }

  IsOnlyAPI(): boolean {
    //Taboola, outbrain default api - Quyết

    return this?.traffic_source &&
      [TS.TABOOLA, TS.OUTBRAIN].includes(this?.traffic_source as any)
      ? true
      : false
  }

  IsInternalLanding() {
    return [DS.ADSENSE, DS.PUBPOWER].includes(this.demand_source as DS)
  }

  IsGGSearch(): boolean {
    return (
      this.IsTrafficGoogle() &&
      this.IsAPI() &&
      this?.campaign_type === CAMP_TYPE.GGSEARCH
    )
  }

  IsCloneCampaign(): boolean {
    //2 cái này giống hệt nhau, chỉ khác chỗ bot là đc đổi account
    return (
      this?.duplicate_type === DUPLICATE_TYPE.DUPLICATE_KEEP_LINK ||
      this?.duplicate_type === DUPLICATE_TYPE.BOT
    )
  }

  IsByBot(): boolean {
    return this?.duplicate_type === DUPLICATE_TYPE.BOT
  }

  IsNotChangeCreateCamp(): boolean {
    if (!this?.traffic_source) return false
    return [TS.MEDIAGO].includes(this?.traffic_source as any)
  }

  isShowPricingRule(): boolean {
    return this?.label === 22
  }

  isShowDirectLink(): boolean {
    if (!this?.demand_source) return false
    if (this.IsTrafficARBTraffic() && this.IsDemandArbCore()) return false

    if (![DS.ADSENSE, DS.PUBPOWER].includes(this.demand_source as any)) {
      return true
    }

    return [DS.ADSENSE, DS.PUBPOWER, DS.ARBCORE].includes(
      this?.demand_source as any
    )
  }

  IsHasAdgroup(): boolean {
    return (this.IsTrafficSnapchat() || this.IsTrafficTiktok()) && this.IsAPI()
  }

  isHybridLabel(): boolean {
    if (!this?.label) return false
    return [21, 24].includes(this?.label)
  }

  isShowUserFlow(): boolean {
    if (
      this?.demand_source === DS.BING1 &&
      this?.landing_pages?.id &&
      this?.landing_pages?.id === 6423
    ) {
      return true
    }

    return false
  }

  isShowVertical(): boolean {
    if (!this.user_flow) return false

    if (
      this?.demand_source === DS.BING1 &&
      this?.landing_pages?.id &&
      this?.landing_pages?.id === 6423
    ) {
      return ['3click'].includes(this?.user_flow)
    }

    return false
  }

  isShowGD(): boolean {
    if (!this?.demand_source) return false
    return [DS.BING1].includes(this?.demand_source as any)
  }

  IsSnapNeedAudience(): boolean {
    return this.IsTrafficSnapchat() &&
      this?.account_supply_id &&
      this?.location &&
      this?.location.value &&
      this?.location.value.length > 0
      ? true
      : false
  }

  IsOnAdvantageCampaignBudget(): boolean {
    return (
      this.IsTrafficFacebook() && this?.advantage_campaign_budget === ONOFF.ON
    )
  }

  IsKwSetDefault(): boolean {
    return this.keyword_set_id === 1
  }

  IsOffAdvantageCampaignBudget(): boolean {
    return (
      this.IsTrafficFacebook() && this?.advantage_campaign_budget === ONOFF.OFF
    )
  }

  IsMaxAdGroup(): boolean {
    const stop = (this?.ad_groups && this?.ad_groups?.length > 100) || false

    if (stop) {
      window.message.warning('You can only duplicate up to 100 ad groups.')
    }

    return stop
  }

  IsMaxAdCreative(): boolean {
    if (this?.ad_groups?.length) {
      let total = 0

      for (let index = 0; index < this.ad_groups?.length; index++) {
        const adgroup = this.ad_groups[index]
        let totalInOne = 0
        if (adgroup.creatives?.length) {
          totalInOne += adgroup.creatives.length
        }
        if (adgroup.ad_creative?.length) {
          totalInOne += adgroup.ad_creative.length
        }

        if (totalInOne > 100) {
          window.message.warning('Too many ads')
          return true
        }

        total += totalInOne
      }

      if (total > 500) {
        window.message.warning('Too many ads in campaign')

        return true
      }
    }

    return false
  }

  IsByClick() {
    return this?.conversion_logic === CONVERSION_LOGIC.BY_CLICK
  }

  IsByEPC() {
    return this?.conversion_logic === CONVERSION_LOGIC.BY_EPC
  }

  IsNotPushToAPI() {
    return this.IsAPI() && !this.traffic_source_id && this.status === ONOFF.OFF
  }

  IsSmartCreated() {
    return Boolean(
      this.campaign_setup === CREATE_CAMP.SMART && this.traffic_source_id
    )
  }

  IsCreativeLandingByCreative(): boolean {
    return this.landing_page_by_creative === ONOFF.ON
  }
  IsSmart() {
    return this.campaign_setup === CREATE_CAMP.SMART
  }

  //Because of your bid strategy (Highest volume), all ad sets in this campaign must use the same optimization for ad delivery.
  IsInvalidPerformanceGoalFB(): boolean {
    if (!this.IsFBHighestBid()) return false

    if (!this.ad_groups || this.ad_groups.length <= 1) return false

    const firstGoal = this.ad_groups[0].performance_goal

    return !this.ad_groups.every((ag) => ag.performance_goal === firstGoal)
  }

  IsAIStatusRejected() {
    return this.ai_status === AI_STATUS.REJECTED
  }
  IsAIStatusSuccess() {
    return this.ai_status === AI_STATUS.SUCCESS
  }
  IsAIStatusPending() {
    return this.ai_status === AI_STATUS.PENDING
  }
  IsAIStatusBotReview() {
    return this.ai_status === AI_STATUS.BOT_REVIEW
  }
  IsAIStatusManualReview() {
    return this.ai_status === AI_STATUS.MANUAL_REVIEW
  }
  IsAIStatusAutoReview() {
    return this.ai_status === AI_STATUS.AUTO_REVIEW
  }
  IsCampOfKen() {
    return this.user?.id === 426
  }

  IsCampOfAnt() {
    // 523, 613, 614, 662
    return (
      this.user?.id === 523 ||
      this.user?.id === 613 ||
      this.user?.id === 614 ||
      this.user?.id === 662
    )
  }

  ResetLandingInAds() {
    try {
      this.ad_groups?.forEach((adgroup) => {
        adgroup.creatives?.forEach((ad) => {
          ad.landing_page_id = null
        })
      })
    } catch {}
  }

  // SET
  SetDirectOn() {
    this.direct_link = ONOFF.ON
  }

  SetDirectOff() {
    this.direct_link = ONOFF.OFF
  }

  SetAPI() {
    this.create_campaign = CREATE_CAMP.API
  }

  SetManual() {
    this.create_campaign = CREATE_CAMP.MANUAL
  }

  SetTrafficTiktok() {
    this.traffic_source = TS.TIKTOK
  }

  SetTrafficGoogle() {
    this.traffic_source = TS.GOOGLE
  }

  SetTrafficFacebook() {
    this.traffic_source = TS.FACEBOOK
  }

  SetTraffic(ts: string) {
    this.traffic_source = ts as TS
  }

  SetCloneMode(clone_mode: any) {
    this.duplicate_type = clone_mode
  }

  SetTypeDemandGen() {
    this.campaign_type = CAMP_TYPE.DEMANDGEN
  }

  SetTypePMax() {
    this.campaign_type = CAMP_TYPE.PERFORMANCEMAX
  }

  SetTypeGGSearch() {
    this.campaign_type = CAMP_TYPE.GGSEARCH
  }
  SetTypeNative() {
    this.campaign_type = CAMP_TYPE.NATIVE
  }

  SetS2SOff() {
    this.search_to_search = ONOFF.OFF
  }

  SetAdvantageCampaignBudgetOff() {
    this.advantage_campaign_budget = ONOFF.OFF
  }

  SetAdvantageCampaignBudgetOn() {
    this.advantage_campaign_budget = ONOFF.ON
  }

  SetCampSetUpManual() {
    this.campaign_setup = CREATE_CAMP.MANUAL
  }
  SetCampSetUpAdvantage() {
    this.campaign_setup = CREATE_CAMP.ADVANTAGE
  }
  SetCampSetUpSmart() {
    this.campaign_setup = CREATE_CAMP.SMART
  }

  SetDefaultAgeGroupFB() {
    if (!this.ad_groups) return
    this.ad_groups.forEach((element) => {
      element.age_groups = ['min_18', 'max_65']
      element.gender = 'genderAll'
    })
  }

  SetOptimizeAIMax() {
    this.optimize_with_AI_max = 'off'
  }

  //Tính năng chỉ dùng cho super admin
  SetDefaultPurchaseValue() {
    this.purchase_value = new PurchaseValue()
  }

  RemoveAllLocations() {
    if (!this.ad_groups) return
    this.ad_groups.forEach((element) => {
      if (element.location?.value?.includes('ALL')) {
        // element.location?.value?.splice(0, element.location?.value?.length); //Dùng cách này nó mới reactive
        // eslint-disable-next-line unicorn/no-useless-spread
        element.location.value = [...[]] //Dùng cách này nó mới reactive
      }
    })
  }

  New() {
    return new campaignTypeClass({
      traffic_source: this.traffic_source,
      demand_source: this.demand_source,
      create_campaign: this.create_campaign,
      creative: {},
    })
  }

  AddDefaultAdgroup(name: string = 'Ad Group 1') {
    if (!this.ad_groups) this.ad_groups = []
    this.ad_groups?.push(newAdGroup(name))
  }

  AddDefaultAdgroupFB(name: string = 'Ad set 1') {
    if (!this.ad_groups) this.ad_groups = []

    this.ad_groups?.push({
      name: name,
      status: 'on',
      conversion_location: 'website',
      // start_date: date2.getCurrentUtcTime(),
      start_date: date2.getNextUtcMidnight(),
      creatives: [
        {
          name: 'Ad 1',
          ad_setup: AD_SETUP.CREATE_AD,
          creative_id: null,
          fanpage: null,
          post_id: null,
        },
      ],
      performance_goal: 'OFFSITE_CONVERSIONS',
      // start_date: date.today(),
      bidding: 'DAILY_BUDGET',
      gender: 'genderAll',
      age_groups: ['min_18', 'max_65'],
      bid_strategy: BIDSTRATEGY.HIGHEST_VOLUME,
      attribution: ATTRIBUTION_SETTING.STANDARD,
      interest: [],
      location: {
        value: [],
        type: 'include',
      },
      language: [],
      schedule: {},
      budget: 5,
      placement_type: PLACEMENT_TYPE.ADVANTAGE,
      audience_type:
        this.categories && this.categories?.length > 0
          ? PLACEMENT_TYPE.MANUAL
          : PLACEMENT_TYPE.ADVANTAGE,
      click_through: 1,
      engaged_view: -1,
      view_through: -1,
    })
  }

  AddDefaultAdgroupSnapChat(name: string = 'Ad Group 1') {
    if (!this.ad_groups) this.ad_groups = []

    this.ad_groups?.push({
      name: name,
      creatives: [],
      device: ['ANDROID', 'iOS', 'WEB'],
      bidding: 'AUTO_BID',
      budget: null,
      cpc: null,
      budget_type: 'daily',
      conversion_event: 'PIXEL_PURCHASE',
      location: {
        value: ['hk'],
        type: 'include',
      },
      gender: 'all',
      age_groups: ['min_13', 'max_50'],
      language: [],
    })
  }

  AddDefaultAdgroupTT(name: string = 'Ad Group 1') {
    if (!this.ad_groups) this.ad_groups = []

    this.ad_groups?.push({
      name: name,
      ads_campaign: 1,
      ads_adgroup: 1,
      status: 'on',
      delivery_type: 'PACING_MODE_SMOOTH',
      pixel: null,
      optimization_event: null,
      bidding: 'BUDGET_MODE_DAY',
      bid_strategy: BIDSTRATEGY.BIDNOBID,
      location: {
        value: ['ALL'],
        type: 'include',
      },
      language: ['ALL'],
      gender: 'GENDER_UNLIMITED',
      age_groups: ['AGE_18_24'],
      placement_type: PLACEMENT_TYPE_TIKTOK.NORMAL,
      placements: ['PLACEMENT_TIKTOK'],
      schedule: {
        type: 'all',
        dayparting: ValDayparting,
      },
    })
  }

  AddDefaultAdgroupNewsbreak(name: string = 'Ad Group 1') {
    if (!this.ad_groups) this.ad_groups = []

    const valDayparting: Dayparting = {
      '0': [],
      '1': [],
      '2': [],
      '3': [],
      '4': [],
      '5': [],
      '6': [],
    }

    this.ad_groups?.push({
      name: name,
      bidding: 'DAILY',
      bid_strategy: null,
      delivery_type: 'EVENLY',
      language: ['all'],
      gender: 'all',
      age_groups: ['all'],
      frequency_caps: [],
      schedule: {
        type: 'all',
        dayparting: valDayparting,
      },
    })
  }

  AddDefaultCreativeFB(adgroup: adGroups) {
    if (!adgroup.creatives) adgroup.creatives = []
    const count =
      (adgroup.creatives?.length || 0) + (adgroup.ad_creative?.length || 0)

    adgroup.creatives.push({
      name: `Ad ${count + 1}`,
      ad_setup: AD_SETUP.CREATE_AD,
    })
  }

  DuplicateAdgroup(adgroup: adGroups) {
    const newAdGroup = helper.clone(adgroup)
    newAdGroup.name = newAdGroup.name + ' (Copy)'
    newAdGroup.id = undefined
    newAdGroup.ad_group_id = undefined
    newAdGroup.campaign_id = undefined
    newAdGroup.status = undefined
    newAdGroup.url_parameters = undefined

    try {
      switch (true) {
        case this.IsTrafficFacebook():
          if (newAdGroup.ad_creative) {
            const creatives: any[] = []
            newAdGroup.ad_creative.forEach((element: any) => {
              try {
                const newCreative = helper.clone(element)

                if (newCreative.creative_id) {
                  newCreative.ad_setup = AD_SETUP.CREATE_AD
                }
                newCreative.id = undefined
                newCreative.status = undefined
                creatives.push(newCreative)
              } catch (error) {
                console.error(error)
              }
            })

            newAdGroup.creatives = creatives
            newAdGroup.ad_creative = undefined
          }
          break

        case this.IsTrafficGoogle():
          if (newAdGroup.ad_creative) {
            const creatives: any[] = []
            newAdGroup.ad_creative.forEach((element: any) => {
              try {
                const newCreative = helper.clone(element)
                newCreative.id = undefined
                newCreative.status = undefined
                creatives.push(newCreative)
              } catch (error) {
                console.error(error)
              }
            })

            newAdGroup.creatives = creatives
            newAdGroup.ad_creative = undefined
          }
          break

        case this.IsTrafficTiktok():
          if (newAdGroup.ad_creative) {
            try {
              const creatives = Array.from(
                new Map(
                  newAdGroup.ad_creative.map((element: any) => {
                    const newCreative = helper.clone(element)
                    newCreative.id = undefined
                    newCreative.status = undefined
                    return [newCreative.creative_id, newCreative]
                  })
                ).values()
              )
              newAdGroup.status = 'on'
              newAdGroup.creatives = creatives
              newAdGroup.ad_creative = undefined
            } catch (error) {
              console.error(error)
            }
          }
          break

        default:
          break
      }
    } catch (error) {
      console.error(error)
    }

    this.ad_groups?.push(newAdGroup)
  }

  DuplicateAdgroup2(adgroup: adGroups) {
    const newAdGroup = helper.clone(adgroup)

    const adGroups = this.ad_groups || []
    const baseName = (newAdGroup.name ?? '').replace(/\s*\(Copy( \d+)?\)$/, '')

    let counter = 1
    let newName = `${baseName} (Copy)`

    while (adGroups.some((g) => g.name === newName)) {
      counter++
      newName = `${baseName} (Copy ${counter})`
    }

    newAdGroup.name = newName
    newAdGroup.id = undefined
    newAdGroup.ad_group_id = undefined
    newAdGroup.campaign_id = undefined
    newAdGroup.status = undefined
    newAdGroup.url_parameters = undefined

    try {
      switch (true) {
        case this.IsTrafficFacebook():
          if (newAdGroup.ad_creative) {
            const creatives: any[] = []
            newAdGroup.ad_creative.forEach((element: any) => {
              try {
                const newCreative = helper.clone(element)

                if (newCreative.creative_id) {
                  newCreative.ad_setup = AD_SETUP.CREATE_AD
                }
                newCreative.id = undefined
                newCreative.status = undefined
                creatives.push(newCreative)
              } catch (error) {
                console.error(error)
              }
            })

            newAdGroup.creatives = creatives
            newAdGroup.ad_creative = undefined
          }
          break

        case this.IsTrafficGoogle():
          if (newAdGroup.ad_creative) {
            const creatives: any[] = []
            newAdGroup.ad_creative.forEach((element: any) => {
              try {
                const newCreative = helper.clone(element)
                newCreative.id = undefined
                newCreative.status = undefined
                creatives.push(newCreative)
              } catch (error) {
                console.error(error)
              }
            })

            newAdGroup.creatives = creatives
            newAdGroup.ad_creative = undefined
          }
          break

        case this.IsTrafficTiktok() || this.IsTrafficNewsbreak():
          if (newAdGroup.ad_creative) {
            try {
              const creatives = Array.from(
                new Map(
                  newAdGroup.ad_creative.map((element: any) => {
                    const newCreative = helper.clone(element)
                    newCreative.id = undefined
                    newCreative.status = undefined
                    return [newCreative.creative_id, newCreative]
                  })
                ).values()
              )
              newAdGroup.status = 'on'
              newAdGroup.creatives = creatives
              newAdGroup.ad_creative = undefined
            } catch (error) {
              console.error(error)
            }
          }
          break

        default:
          break
      }
    } catch (error) {
      console.error(error)
    }

    this.ad_groups?.push(newAdGroup)
  }

  ClearAdGroupBidAndCost() {
    if (!this.ad_groups) return
    this.ad_groups.forEach((adgroup) => {
      adgroup.cost_per_result = null
      adgroup.bid_strategy = null
    })
  }

  SetAdGroupDefaultBidStrategy() {
    if (!this.ad_groups) return
    this.ad_groups.forEach((adgroup) => {
      adgroup.bid_strategy = BIDSTRATEGY.HIGHEST_VOLUME
    })
  }
}

export function newAdGroup(name: string = 'Ad Group 1'): adGroups {
  return {
    name: name,
    creatives: [],
    status: 'on',
    search_themes: [],
    location: {
      value: [],
      type: 'include',
    },
    language: [],
    bidding_status: false,
    budget: 0,
    cpc: 0,
    listPlacements: [],
  }
}

export function newCampaignClass(ts: TS): campaignTypeClass {
  const isShowPurchase =
    window.arb.isAdmin() || window.arb.isDev() || window.arb.isAnt()
  switch (ts) {
    case TS.FACEBOOK:
      const tempFB = new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        create_campaign: CREATE_CAMP.API,
        landing_pages: {},
        label: 0,
        buying_type: 'AUCTION',
        type: 'OUTCOME_SALES',
        budget: 1,
        bidding: 'DAILY_BUDGET',
        campaign_setup: CREATE_CAMP.ADVANTAGE,
        advantage_campaign_budget: ONOFF.OFF,
        prelanding: ONOFF.OFF,
        bid_strategy: BIDSTRATEGY.HIGHEST_VOLUME,

        landing_page_by_creative: ONOFF.ON,
      })
      tempFB.SetAdvantageCampaignBudgetOn()
      tempFB.AddDefaultAdgroupFB()

      if (isShowPurchase) tempFB.SetDefaultPurchaseValue()

      return tempFB
    case TS.GOOGLE:
      const tempGG = new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        create_campaign: CREATE_CAMP.API,
        landing_pages: {},
        label: 0,
        bidding_status: false,
        cpc: 0,
        listPlacements: [],
        budget: 0,
        bidding: 'maximizeConversions',
        campaign_type: CAMP_TYPE.GGSEARCH,
        location: {
          value: [],
          type: 'include',
        },
        language: [],
        prelanding: ONOFF.OFF,

        landing_page_by_creative: ONOFF.ON,
      })

      tempGG.AddDefaultAdgroup()

      if (isShowPurchase) tempGG.SetDefaultPurchaseValue()

      return tempGG
    case TS.SMART_NEW:
      const tempSmartNew = new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        create_campaign: CREATE_CAMP.MANUAL,
        landing_pages: {},
        label: 0,
        listPlacements: [],
        campaign_type: CAMP_TYPE.GGSEARCH,
        prelanding: ONOFF.OFF,
      })

      return tempSmartNew
    case TS.TABOOLA:
      return new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: TS.TABOOLA,
        create_campaign: CREATE_CAMP.API,
        landing_pages: {},
        label: 0,
        type: 'LEADS_GENERATION',
        ads_campaign: 10,
        creative: {},
        location: {
          value: [],
          type: 'include',
        },
        language: [],
        schedule: {
          type: 'all',
          value: [
            {
              type: 'INCLUDE',
              day: 'MONDAY',
              from_hour: 0,
              until_hour: 24,
            },
            {
              type: 'INCLUDE',
              day: 'TUESDAY',
              from_hour: 0,
              until_hour: 24,
            },
            {
              type: 'INCLUDE',
              day: 'WEDNESDAY',
              from_hour: 0,
              until_hour: 24,
            },
            {
              type: 'INCLUDE',
              day: 'THURSDAY',
              from_hour: 0,
              until_hour: 24,
            },
            {
              type: 'INCLUDE',
              day: 'FRIDAY',
              from_hour: 0,
              until_hour: 24,
            },
            {
              type: 'INCLUDE',
              day: 'SATURDAY',
              from_hour: 0,
              until_hour: 24,
            },
            {
              type: 'INCLUDE',
              day: 'SUNDAY',
              from_hour: 0,
              until_hour: 24,
            },
          ],
        },
        prelanding: ONOFF.OFF,

        landing_page_by_creative: ONOFF.ON,
      })
    case TS.NONE:
      return new campaignTypeClass({
        origin_name: 'New Campaign',
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        // traffic_source: TS.NONE,
        create_campaign: CREATE_CAMP.MANUAL,
        landing_pages: {},
        label: 0,
        prelanding: ONOFF.OFF,

        landing_page_by_creative: ONOFF.OFF,
      } as campaignTypeClass)

    case TS.NEWSBREAK:
      const tempNewsBreak = new campaignTypeClass({
        origin_name: 'New Campaign',
        status: ONOFF.ON,
        type: 'WEB_CONVERSION',
        direct_link: ONOFF.ON,
        traffic_source: TS.NEWSBREAK,
        create_campaign: CREATE_CAMP.MANUAL,
        landing_pages: {},
        label: 0,
        prelanding: ONOFF.OFF,
        keyword_macro: '',

        landing_page_by_creative: ONOFF.ON,
      } as campaignTypeClass)

      tempNewsBreak.AddDefaultAdgroupNewsbreak()
      return tempNewsBreak

    case TS.SNAPCHAT:
      const tempSnapchat = new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        create_campaign: CREATE_CAMP.API,
        landing_pages: {},
        label: 0,
        // ads_campaign: 1,
        // ads_adgroup: 1,
        snapchat_audience: {
          pre_audience: [],
          audience: [],
        } as SnapchatAudience,
        prelanding: ONOFF.OFF,
        // gender: 'all',
        // age_groups: ['min_13', 'max_50'],

        landing_page_by_creative: ONOFF.ON,
      })

      tempSnapchat.AddDefaultAdgroupSnapChat()

      return tempSnapchat

    case TS.MEDIAGO:
      return new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        create_campaign: CREATE_CAMP.MANUAL,
        landing_pages: {},
        label: 0,
        prelanding: ONOFF.OFF,

        landing_page_by_creative: ONOFF.ON,
      } as campaignTypeClass)

    case TS.MGID:
    case TS.QUANTUMDEX:
    case TS.REVCONTENT:
      return new campaignTypeClass({
        origin_name: 'New Campaign',
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        ads_campaign: 10,
        create_campaign: CREATE_CAMP.API,
        landing_pages: {},
        creative: {},
        location: {
          value: [],
          type: 'include',
        },
        language: [],
        prelanding: ONOFF.OFF,
        landing_page_by_creative: ONOFF.ON,
      })

    case TS.ZEMANTA:
      return new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        ads_campaign: 10,
        create_campaign: CREATE_CAMP.API,
        landing_pages: {},
        creative: {},
        location: {
          value: [],
          type: 'include',
        },
        language: [],
        prelanding: ONOFF.OFF,
        landing_page_by_creative: ONOFF.ON,
      })

    case TS.OUTBRAIN:
      return new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        ads_campaign: 10,
        create_campaign: CREATE_CAMP.API,
        landing_pages: {},
        msn_exclusively: ONOFF.OFF,
        impact_placements: ONOFF.OFF,
        exclude_adblock: ONOFF.OFF,
        creative: {},
        location: {
          value: [],
          type: 'include',
        },
        language: [],
        prelanding: ONOFF.OFF,

        landing_page_by_creative: ONOFF.ON,
      })

    case TS.POCPOC:
      return new campaignTypeClass({
        origin_name: 'New Campaign',
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        ads_campaign: 10,
        create_campaign: CREATE_CAMP.API,
        landing_pages: {},
        placement: 'placement',
        creative: {},
        location: {
          value: [],
          type: 'include',
        },
        prelanding: ONOFF.OFF,

        landing_page_by_creative: ONOFF.OFF,
        keyword_manager: {
          domain: '',
          keywords_campaign: [],
        },
      })

    case TS.TIKTOK:
      const tempTT = new campaignTypeClass({
        origin_name: 'New Campaign',
        is_multiple_creative: true,
        demand_source: DS.ADSENSE,
        status: ONOFF.ON,
        direct_link: ONOFF.ON,
        traffic_source: ts,
        ads_campaign: 1,
        ads_adgroup: 1,

        create_campaign: CREATE_CAMP.API,
        campaign_setup: CREATE_CAMP.MANUAL,
        delivery_type: 'PACING_MODE_SMOOTH',
        landing_pages: {},
        optimization_goal: 'CONVERT',
        type: 'WEB_CONVERSIONS',
        creative_type: 'CUSTOM',
        comment_disabled: true,
        video_download_disabled: false,
        share_disabled: true,
        schedule: {
          type: 'all',
          dayparting: ValDayparting,
        },
        budget_optimize_on: 'off',
        creative: {},
        location: {
          value: [],
          type: 'include',
        },
        language: [],
        prelanding: ONOFF.OFF,

        landing_page_by_creative: ONOFF.ON,
      })

      tempTT.AddDefaultAdgroupTT()
      if (isShowPurchase) tempTT.SetDefaultPurchaseValue()

      return tempTT
  }

  return {} as campaignTypeClass
}

export class SelectOptionsManager {
  fanpageOptions: SelectOption[] = []
  loadingFanpage: boolean = true

  creativeOptions: SelectOption[] = []
  loadingCreative: boolean = true

  constructor() {}

  async fetchFanpageOptions(params?: any) {
    this.loadingFanpage = true
    const result = await ctr_traffic_source.GetFacebookPage(params || {}, {})
    this.fanpageOptions = result?.data || []

    this.loadingFanpage = false
  }

  async fetchCreativeOptions(params: any) {
    if (!params.ts) {
      console.warn('fetchCreativeOptions: Missing traffic source')
      return
    }
    this.loadingCreative = true

    this.creativeOptions = await fetchCreativeNew(
      params.ts,
      {
        q: params.q || '',
        notfound: '1',
        id: params.ids,
        info: '1',
      },
      params.type
    )

    this.loadingCreative = false
  }
}

export const GroupIs = {
  PerformanceGoalNumber(adgroup: adGroups) {
    return adgroup.performance_goal === 'OFFSITE_CONVERSIONS'
  },

  PerformanceGoalValue(adgroup: adGroups) {
    return adgroup.performance_goal === 'VALUE'
  },
}

export const GroupSet = {}

export const statusDescriptions: Partial<
  Record<AI_STATUS, { main: string; note: string; type: string }>
> = {
  [AI_STATUS.SUCCESS]: {
    main: 'Approved',
    note: 'Campaign has been successfully approved',
    type: AI_STATUS.SUCCESS,
  },

  [AI_STATUS.PENDING]: {
    main: 'Pending',
    note: 'Campaign is currently under review',
    type: AI_STATUS.PENDING,
  },
  [AI_STATUS.BOT_REVIEW]: {
    main: 'AI Recheck',
    note: 'Campaign has been rechecked by AI',
    type: AI_STATUS.BOT_REVIEW,
  },
  [AI_STATUS.MANUAL_REVIEW]: {
    main: 'Manual Review',
    note: 'Campaign has been reviewed by an authorized person',
    type: AI_STATUS.MANUAL_REVIEW,
  },
  [AI_STATUS.REJECTED]: {
    main: 'Rejected',
    note: 'Campaign was rejected due to policy violations',
    type: AI_STATUS.REJECTED,
  },
}

export function AddCreativeSingleImage(
  oldFeature?: Partial<CreativeFeaturesSpec>,
  isTrue?: boolean // page edit || page duplicate
): CreativeFeaturesSpec {
  const data: CreativeFeaturesSpec = {
    image_touchups: { enroll_status: ENROLL_STATUS.OPT_IN },
    image_templates: { enroll_status: ENROLL_STATUS.OPT_IN },
    image_animations: { enroll_status: ENROLL_STATUS.OPT_IN },
    enhance_cta: { enroll_status: ENROLL_STATUS.OPT_IN },
    text_optimizations: { enroll_status: ENROLL_STATUS.OPT_IN },
    flex_media: { enroll_status: ENROLL_STATUS.OPT_IN },
    image_music: { enroll_status: ENROLL_STATUS.OPT_IN },
  }

  if (oldFeature) {
    for (const key in data) {
      const featureKey = key as keyof CreativeFeaturesSpec

      if (
        data[featureKey] &&
        oldFeature[featureKey]?.enroll_status === ENROLL_STATUS.OPT_OUT
      ) {
        data[featureKey]!.enroll_status = ENROLL_STATUS.OPT_OUT
      }
    }
  } else {
    if (isTrue) {
      for (const key in data) {
        const featureKey = key as keyof CreativeFeaturesSpec
        data[featureKey]!.enroll_status = ENROLL_STATUS.OPT_IN
      }
    }
  }

  // RemoveKeySingleImage.forEach((key) => {
  //   if (data[key]) {
  //     data[key].enroll_status = ENROLL_STATUS.OPT_OUT
  //   }
  // })

  return data
}

export function CreativeSingleImageDefault() {
  // chỉ set image_music = OPT_OUT
  return {
    image_touchups: { enroll_status: ENROLL_STATUS.OPT_IN },
    image_templates: { enroll_status: ENROLL_STATUS.OPT_IN },
    image_animations: { enroll_status: ENROLL_STATUS.OPT_IN },
    enhance_cta: { enroll_status: ENROLL_STATUS.OPT_IN },
    text_optimizations: { enroll_status: ENROLL_STATUS.OPT_IN },
    flex_media: { enroll_status: ENROLL_STATUS.OPT_IN },
    image_music: { enroll_status: ENROLL_STATUS.OPT_OUT },
  }
}

export function AddCreativeSingleVideo(
  oldFeature?: Partial<CreativeFeaturesSpec>,
  isEditPage?: boolean
): CreativeFeaturesSpec {
  const data: CreativeFeaturesSpec = {
    creative_stickers: { enroll_status: ENROLL_STATUS.OPT_IN },
    video_auto_crop: { enroll_status: ENROLL_STATUS.OPT_IN },
    video_effects: { enroll_status: ENROLL_STATUS.OPT_IN },
    video_expand: { enroll_status: ENROLL_STATUS.OPT_IN },
    enhance_cta: { enroll_status: ENROLL_STATUS.OPT_IN },
    text_optimizations: { enroll_status: ENROLL_STATUS.OPT_IN },
  }

  if (oldFeature) {
    for (const key in data) {
      const featureKey = key as keyof CreativeFeaturesSpec

      if (
        data[featureKey] &&
        oldFeature[featureKey]?.enroll_status === ENROLL_STATUS.OPT_OUT
      ) {
        data[featureKey]!.enroll_status = ENROLL_STATUS.OPT_OUT
      }
    }
  } else {
    if (isEditPage) {
      for (const key in data) {
        const featureKey = key as keyof CreativeFeaturesSpec
        data[featureKey]!.enroll_status = ENROLL_STATUS.OPT_IN
      }
    }
  }

  // RemoveKeySingleVideo.forEach((key) => {
  //   if (data[key]) {
  //     data[key].enroll_status = ENROLL_STATUS.OPT_OUT
  //   }
  // })

  return data
}

export function AddCreativeCarousel(
  oldFeature?: Partial<CreativeFeaturesSpec>,
  isEditPage?: boolean
): CreativeFeaturesSpec {
  const data: CreativeFeaturesSpec = {
    image_touchups: { enroll_status: ENROLL_STATUS.OPT_IN },
    enhance_cta: { enroll_status: ENROLL_STATUS.OPT_IN },
    image_music: { enroll_status: ENROLL_STATUS.OPT_IN },
    profile_end_card: { enroll_status: ENROLL_STATUS.OPT_IN },
    dynamic_description: { enroll_status: ENROLL_STATUS.OPT_IN },
    highlight_carousel_card: { enroll_status: ENROLL_STATUS.OPT_IN },
    adapt_multi_image_format: { enroll_status: ENROLL_STATUS.OPT_IN },
  }

  if (oldFeature) {
    for (const key in data) {
      const featureKey = key as keyof CreativeFeaturesSpec

      if (
        data[featureKey] &&
        oldFeature[featureKey]?.enroll_status === ENROLL_STATUS.OPT_OUT
      ) {
        data[featureKey]!.enroll_status = ENROLL_STATUS.OPT_OUT
      }
    }
  } else {
    if (isEditPage) {
      for (const key in data) {
        const featureKey = key as keyof CreativeFeaturesSpec
        data[featureKey]!.enroll_status = ENROLL_STATUS.OPT_IN
      }
    }
  }

  return data
}
