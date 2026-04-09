import { YES_NO } from '@/enum/campaign'
import { SelectOption } from 'naive-ui'

export const percentOfOptions = [
  { label: '% of', value: 'percent_of', disabled: false },
  { label: '% of campaign', value: 'percent_of_campaign', disabled: false },
]

export const RuleBudgetComparisonOption = [
  { label: 'of Current Budget', value: 'current_budget' },
  { label: 'of Supply CPC Realtime', value: 'supply_cpc_rt' },
  { label: 'of Supply CPC', value: 'supply_cpc' },
  { label: 'of EPC Realtime', value: 'epc_rt' },
  { label: 'of EPC', value: 'epc' },
]

export const RuleBidComparisonOption = [
  { label: 'of Current Bid', value: 'current_bid' },
  { label: 'of Supply CPC Realtime', value: 'supply_cpc_rt' },
  { label: 'of Supply CPC', value: 'supply_cpc' },
  { label: 'of EPC Realtime', value: 'epc_rt' },
  { label: 'of EPC', value: 'epc' },
  { label: 'of RPC', value: 'demand_cpc' },
  { label: 'RPC Last X Conversions', value: 'rpc_last_x_conversions' },
]

export const RuleThanOption = [
  { label: 'On', value: 1 },
  { label: 'Off', value: 2 },
]

export const RuleComparisonOption = [
  { label: 'Equal', value: 'equal' },
  { label: 'Greater', value: 'greater' },
  { label: 'Less', value: 'less' },
  { label: 'Greater or Equal', value: 'greater_or_equal' },
  { label: 'Less or Equal', value: 'less_or_equal' },
]

export const RuleScheduleOptions = [
  { label: 'Every 2 Minutes', value: 'every_2_min' },
  { label: 'Every 5 Minutes', value: 'every_5_min' },
  { label: 'Every 10 Minutes', value: 'every_10_min' },
  { label: 'Every 15 Minutes', value: 'every_15_min' },
  { label: 'Every 20 Minutes', value: 'every_20_min' },
  { label: 'Every 30 Minutes', value: 'every_30_min' },
  { label: 'Every 1 Hour', value: 'every_1_hour' },
  { label: 'Every 2 Hours', value: 'every_2_hour' },
  { label: 'Every 3 Hours', value: 'every_3_hour' },
  { label: 'Every 6 Hours', value: 'every_6_hour' },
  { label: 'Every 12 Hours', value: 'every_12_hour' },
  { label: 'Daily (at Time UTC)', value: 'daily' },
  { label: 'Every Custom Days (at Time UTC)', value: 'every_custom_day' },
  { label: 'Weekly (at Time UTC on Saturday)', value: 'weekly' },
]

export const RuleScheduleOptionsV2 = [
  { label: 'Day', value: 'day_unit' },
  { label: 'Hour', value: 'hour_unit' },
  { label: 'Minute', value: 'minute_unit' },
]

export const RuleExIntervalOption = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Today & Yesterday', value: 'today_yesterday' },
  { label: 'Last 3 Days', value: 'last_3_day' },
]

export const optionTypes = [
  { label: 'No', value: YES_NO.NO },
  { label: 'Yes', value: YES_NO.YES },
]

export const promotionStatusOptions = [
  {
    label: 'Redeemed: Complete further requirements',
    value: 'Redeemed: Complete further requirements',
  },
  { label: 'Processing', value: 'Processing' },
  { label: 'Credit expired', value: 'Credit expired' },
  { label: 'Expired', value: 'Expired' },
  { label: 'Active', value: 'Active' },
  { label: 'Invalidated', value: 'Invalidated' },
]

export const biddingCPAOptions: SelectOption[] = [
  { label: 'Auto', value: 'MAX_CONVERSIONS' },
  { label: 'Target CPA', value: 'TARGET_CPA' },
]
export const biddingCPCCPMOptions: SelectOption[] = [
  { label: 'Smart Bid', value: 'OPTIMIZED_CONVERSIONS' },
  { label: 'Fixed Bid', value: 'FIXED' },
]

export const deliveryOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Frozen', value: 'frozen' },
  { label: 'Paused', value: 'paused' },
  { label: 'LEARNING', value: 'LEARNING' },
]
export const biddingModeOptions: SelectOption[] = [
  { label: 'Fixed', value: 'fixed', prefix: '$' },
  { label: '% of RPC', value: 'rpc', suffix: '%' },
]
export const dataSourceOptions = ref<SelectOption[]>([
  { label: 'Fixed', value: 'fixed' },
  { label: 'Dynamic', value: 'dynamic' },
])
export const goalsOptions = ref<SelectOption[]>([
  { label: 'Lead', value: 'lead' },
  { label: 'Purchase', value: 'purchase' },
  { label: 'Search', value: 'search' },
])
