import CopyOutline from '@/assets/icons/CopyOutline.vue'
import Edit20Regular from '@/assets/icons/Edit20Regular.vue'
import {
  AD_SETUP,
  ATTRIBUTION_SETTING,
  BIDSTRATEGY,
  CAMP_TYPE,
  DEVICE,
  TIME_ZONE_TYPE,
} from '@/enum/campaign'
import { renderIcon } from '@/utils/utils'

export const BudgetOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'lifetime', label: 'Lifetime' },
]

export const ConversionEventSnapchatOptions = [
  { label: 'Pixel Purchase', value: 'PIXEL_PURCHASE' },
  { label: 'Pixel Signup', value: 'PIXEL_SIGNUP' },
  { label: 'Pixel Page View', value: 'PIXEL_PAGE_VIEW' },
  { label: 'Pixel Add To Cart', value: 'PIXEL_ADD_TO_CART' },
]

export const ConversionEventFacebookOptions = [
  { label: 'Search', value: 'SEARCH' },
  { label: 'ViewContent', value: 'CONTENT_VIEW' },
  { label: 'CompleteRegistration', value: 'COMPLETE_REGISTRATION' },
  { label: 'Purchase', value: 'PURCHASE' },
  { label: 'Lead', value: 'LEAD' },
]

export const GDOptions = [
  { label: 'AP1008512 (Google)', value: 'AP1008512' },
  { label: 'AP1008513 (Taboola)', value: 'AP1008513' },
  { label: 'AP1008514 (Facebook)', value: 'AP1008514' },
]

export const PerformanceGoalOptions = [
  { value: 'OFFSITE_CONVERSIONS', label: 'Maximize number of conversions' },
  { value: 'VALUE', label: 'Maximize value of conversions' },
]

export const ConversionGoalsOptions = [
  { value: 'PURCHASE', label: 'Purchase' },
  { value: 'PAGE_VIEW', label: 'Page view' },
  { value: 'OUTBOUND_CLICK', label: 'Outbound click' },
  { value: 'DEFAULT', label: 'Search' },
]

export const BiddingBidControl = [
  { label: 'Smart Bid', value: 'OPTIMIZED_CONVERSIONS' },
  { label: 'Fixed Bid', value: 'FIXED' },
]

export const BiddingMaxConversion = [
  { label: 'Auto', value: 'MAX_CONVERSIONS' },
  { label: 'Target CPA', value: 'TARGET_CPA' },
  { label: 'CPC Cap', value: 'CPC_CAP' },
]

export const BiddingOptionsGoogle = [
  { label: 'Conversions', value: 'maximizeConversions' },
  { label: 'Conversion Value', value: 'maximizeConversionValue' },
  { label: 'Clicks', value: 'targetSpend' },
]

export const BiddingOptionsDuplicate = [
  { label: 'Bid CAP', value: 'bid_cap' },
  { label: 'Target CPA', value: 'target_cpa' },
]

export const BiddingOptionsGGDisplay = [
  { label: 'Manual CPC', value: 'manual_cpc' },
  { label: 'Maximize Conversions', value: 'maximizeConversions' },
  { label: 'Maximize Conversion Value', value: 'maximizeConversionValue' },
  { label: 'Target CPA', value: 'target_cpa' },
  { label: 'Target ROAS', value: 'target_roas' },
  { label: 'Maximize clicks', value: 'target_spend' },
]

export const AdSetupOptions = [
  {
    value: AD_SETUP.CREATE_AD,
    label: 'Create ad',
  },
  {
    value: AD_SETUP.USE_EXISTING_POST,
    label: 'Use existing post',
  },
]

export const ClickThroughOptions = [
  { value: 1, label: '1 day' },
  { value: 7, label: '7 days' },
]

export const DayOptions = [
  { value: -1, label: 'None' },
  { value: 1, label: '1 day' },
]

export const AttributionOptions = [
  { value: ATTRIBUTION_SETTING.STANDARD, label: 'Standard' },
  {
    value: ATTRIBUTION_SETTING.INCREMENTAL,
    label: 'Incremental',
  },
]

export const ManualVerifyOptions = [
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export const PurchaseValueTypeOptions = [
  {
    value: 'rpc_to_day_min_x_conversions',
    label: 'RPC to day min x conversions',
  },
  { value: 'fixed_value', label: 'Fixed value' },
  { value: 'none_value', label: 'None value' },
]

export const userFlowOptions = [
  { label: '2 Click', value: '2click' },
  { label: '3 Click', value: '3click' },
]
export const optionCopy = [
  { key: 'edit_fanpage', label: 'Fanpage', icon: renderIcon(Edit20Regular) },
  { key: 'id', label: 'Copy ID', icon: renderIcon(CopyOutline) },
  { key: 'name', label: 'Copy Name', icon: renderIcon(CopyOutline) },
]

export const optionType = [
  { label: 'Banner', value: 'banner' },
  { label: 'Adsense', value: 'adsense' },
  { label: 'Native', value: 'native' },
]

export const timeZoneTypeOptions = [
  {
    label: "Use this ad account's time zone",
    value: TIME_ZONE_TYPE.ADVERTISER,
  },
  { label: "User viewer's time zone", value: TIME_ZONE_TYPE.USER },
]

export const budgetTypeOptions = [
  { value: 'DAILY_BUDGET', label: 'Daily budget' },
  { value: 'LIFETIME_BUDGET', label: 'Lifetime budget' },
]

export const conversionLocationOptions = [
  { value: 'website', label: 'Website' },
  { value: 'website_call', label: 'Website and calls', disabled: true },
  { value: 'instant_form', label: 'Instant forms', disabled: true },
  { value: 'messenger', label: 'Messenger', disabled: true },
  {
    value: 'instant_form_messenger',
    label: 'Instant forms and Messenger',
    disabled: true,
  },

  {
    value: 'instagram',
    label: 'Instagram',
    disabled: true,
  },
  {
    value: 'whatsapp',
    label: 'Whatsapp',
    disabled: true,
  },

  {
    value: 'call',
    label: 'Calls',
    disabled: true,
  },

  {
    value: 'app',
    label: 'App',
    disabled: true,
  },
]

export const deviceOptions = [
  { label: 'All devices (recommended)', value: DEVICE.ALL },
  { label: 'Mobile', value: DEVICE.MOBILE },
  { label: 'Desktop', value: DEVICE.DESKTOP },
]

export const originalBidStrategyOptions = [
  { value: BIDSTRATEGY.HIGHEST_VOLUME, label: 'Highest volume' },
  { value: BIDSTRATEGY.COST_PER_RESULT_GOAL, label: 'Cost per result goal' },
  { value: BIDSTRATEGY.ROAS_GOAL, label: 'ROAS goal' },
  { value: BIDSTRATEGY.BID_CAP, label: 'Bid cap' },
]

export const buyingTypeOptions = [
  { value: 'AUCTION', label: 'AUCTION' },
  { value: 'Reach and Frequency', label: 'Reach and Frequency' },
]

export const categoryOptions = [
  {
    value: 'FINANCIAL_PRODUCTS_SERVICES',
    label: 'Financial products and services (Credit)',
  },
  { value: 'EMPLOYMENT', label: 'Employment' },
  { value: 'HOUSING', label: 'Housing' },
  {
    value: 'SOCIAL_ISSUES',
    label: 'Social issues, elections or politics',
    disabled: true,
  },
]

export const adSetupOptions = [
  {
    value: AD_SETUP.CREATE_AD,
    label: 'Create ad',
  },
  {
    value: AD_SETUP.USE_EXISTING_POST,
    label: 'Use existing post',
  },
]

export const systemOptions = [
  { value: 630159, label: 'Android' },
  { value: 630252, label: 'BlackBerry' },
  { value: 630153, label: 'iOS' },
  { value: 630160, label: 'webOS' },
  { value: 630266, label: 'Windows Phone' },
]

export const budgetOptions = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'TOTAL', label: 'Life time' },
]

export const deliveryTypeOptions = [
  { label: 'Evenly', value: 'EVENLY' },
  { label: 'Asap', value: 'ASAP' },
]

export const campaignTypePocpoc = [
  { label: 'Native', value: CAMP_TYPE.NATIVE },
  { label: 'Banner', value: CAMP_TYPE.BANNER },
]

export const placeTargetOptions = [
  { label: 'All Placement', value: 'placement' },
  { label: 'Target by Active View', value: 'activeView' },
  { label: 'Target by Ad Format', value: 'adFormat' },
]

export const biddingOptions = [
  { label: 'Auto-Bid', value: 'AUTO_BID' },
  { label: 'Target Cost', value: 'TARGET_COST' },
  { label: 'Max Bid', value: 'LOWEST_COST_WITH_MAX_BID' },
]

export const biddingStrategyOptions = [
  { label: 'Maximize Conversions (CPA)', value: 'CPA' },
  { label: 'Bid Control (CPC/CPM)', value: 'CPC/CPM' },
]

export const hoursOptionsStart = [
  {
    label: '12:00 AM',
    value: 0,
  },
  {
    label: '01:00 AM',
    value: 1,
  },
  {
    label: '02:00 AM',
    value: 2,
  },
  {
    label: '03:00 AM',
    value: 3,
  },
  {
    label: '04:00 AM',
    value: 4,
  },
  {
    label: '05:00 AM',
    value: 5,
  },
  {
    label: '06:00 AM',
    value: 6,
  },
  {
    label: '07:00 AM',
    value: 7,
  },
  {
    label: '08:00 AM',
    value: 8,
  },
  {
    label: '09:00 AM',
    value: 9,
  },
  {
    label: '10:00 AM',
    value: 10,
  },
  {
    label: '11:00 AM',
    value: 11,
  },
  {
    label: '12:00 PM',
    value: 12,
  },
  {
    label: '01:00 PM',
    value: 13,
  },
  {
    label: '02:00 PM',
    value: 14,
  },
  {
    label: '03:00 PM',
    value: 15,
  },
  {
    label: '04:00 PM',
    value: 16,
  },
  {
    label: '05:00 PM',
    value: 17,
  },
  {
    label: '06:00 PM',
    value: 18,
  },
  {
    label: '07:00 PM',
    value: 19,
  },
  {
    label: '08:00 PM',
    value: 20,
  },
  {
    label: '09:00 PM',
    value: 21,
  },
  {
    label: '10:00 PM',
    value: 22,
  },
  {
    label: '11:00 PM',
    value: 23,
  },
  // {
  //   label: '12:00 AM',
  //   value: 24,
  // },
]
export const hoursOptionsEnd = [
  // {
  //   label: '12:00 AM',
  //   value: 0,
  // },
  {
    label: '01:00 AM',
    value: 1,
  },
  {
    label: '02:00 AM',
    value: 2,
  },
  {
    label: '03:00 AM',
    value: 3,
  },
  {
    label: '04:00 AM',
    value: 4,
  },
  {
    label: '05:00 AM',
    value: 5,
  },
  {
    label: '06:00 AM',
    value: 6,
  },
  {
    label: '07:00 AM',
    value: 7,
  },
  {
    label: '08:00 AM',
    value: 8,
  },
  {
    label: '09:00 AM',
    value: 9,
  },
  {
    label: '10:00 AM',
    value: 10,
  },
  {
    label: '11:00 AM',
    value: 11,
  },
  {
    label: '12:00 PM',
    value: 12,
  },
  {
    label: '01:00 PM',
    value: 13,
  },
  {
    label: '02:00 PM',
    value: 14,
  },
  {
    label: '03:00 PM',
    value: 15,
  },
  {
    label: '04:00 PM',
    value: 16,
  },
  {
    label: '05:00 PM',
    value: 17,
  },
  {
    label: '06:00 PM',
    value: 18,
  },
  {
    label: '07:00 PM',
    value: 19,
  },
  {
    label: '08:00 PM',
    value: 20,
  },
  {
    label: '09:00 PM',
    value: 21,
  },
  {
    label: '10:00 PM',
    value: 22,
  },
  {
    label: '11:00 PM',
    value: 23,
  },
  {
    label: '12:00 AM',
    value: 24,
  },
]

export const budgetOptionsTT = [
  { value: 'BUDGET_MODE_DAY', label: 'Daily' },
  { value: 'BUDGET_MODE_TOTAL', label: 'Lifetime' },
]

export const campaignSetupOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'smart', label: 'Smart' },
]

export const deliveryTypeOptionsTT = [
  { label: 'Standard', value: 'PACING_MODE_SMOOTH' },
  { label: 'Accelerated', value: 'PACING_MODE_FAST' },
]

export const campaignTypeOptions = [
  { value: 'demand_gen', label: 'Demand Gen' },
  { value: 'performance_max', label: 'Performance Max' },
]

export const biddingStrategyOptionsCrawl = [
  { label: 'Maximize Conversions (CPA)', value: 'CPA' },
  { label: 'Bid Control (CPC/CPM)', value: 'CPC/CPM' },
]

export const deviceOptionsGGDisplay = [
  { name: 'All devices', value: 'ALL' },
  { name: 'Computers', value: 'COMPUTER' },
  { name: 'Mobile phones', value: 'MOBILE' },
  { name: 'Tablets', value: 'TABLET' },
]
