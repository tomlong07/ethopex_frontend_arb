import { CAMP_TYPE, TS } from '@/enum/campaign'
import {
  BiddingBidControl,
  BiddingMaxConversion,
  BiddingOptionsGGDisplay,
  BiddingOptionsGoogle,
  budgetTypeOptions,
  ConversionGoalsOptions,
} from '@/options/campaign'

import { SelectOption } from 'naive-ui'

export function FindBiddingLabel(
  value: string,
  ts: string,
  campaign_type: string
) {
  let optionsFind: SelectOption[] = []

  if (ts === TS.GOOGLE && campaign_type === CAMP_TYPE.GGDISPLAY) {
    optionsFind = BiddingOptionsGGDisplay
  } else {
    optionsFind = optionsFind.concat(
      BiddingOptionsGoogle,
      BiddingBidControl,
      BiddingMaxConversion,
      budgetTypeOptions
    )
  }

  const found = optionsFind.find((item) => item.value === value)
  return (found?.label as string) || value
}

export const FindConversionGoalLabel = (value: string) => {
  const found = ConversionGoalsOptions.find((item) => item.value === value)

  return (found?.label as string) || value
}
