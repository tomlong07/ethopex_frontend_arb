import api_v2 from '@/core/api_v2'

const defaultDialog = () => {
  return {
    name: 'Dialog',
    data: {
      headline: { name: 'Headline Text' },
      body: { name: 'Body Text' },
      ad_option: { name: 'Ad Option Text' },
      ad_option_sub: { name: 'Ad Option Sub Text' },
      thank_you: { name: 'Thank You Snackbar' },
    },
  }
}

const defaultDialogUnlock = () => {
  return {
    name: 'Dialog',
    data: {
      image: { name: 'Image' },
      heading: { name: 'Heading' },
      subheading: { name: 'SubHeading' },
      call_to_action: { name: 'Call To Action' },
      button_text: { name: 'Button Text' },
    },
  }
}

const adFormatArray = [
  { id: 'display', name: 'Display' },
  { id: 'anchor', name: 'Anchor' },
  { id: 'interstitial', name: 'Interstitial' },
  {
    id: 'rewarded',
    name: 'Rewarded',
    dialog: defaultDialog(),
  },
  {
    id: 'unlock_content',
    name: 'Unlock Content',
    type: 'default',
    dialog: defaultDialogUnlock(),
  },
]
const adFormatObj = {} as { [key: string]: any }

adFormatArray.forEach((element) => {
  adFormatObj[element.id] = element
})

export default {
  changeDemandSourceIfNotHave: (
    demandOptions: Ref,
    campaign: Ref,
    opts: any = {}
  ) => {
    if (!demandOptions.value.length) {
      if (opts?.notify) {
        window.message.error(
          'You do not have any demand source, please contact admin to add new demand source'
        )
      }

      return
    }
    let found = false

    for (let index = 0; index < demandOptions.value.length; index++) {
      if (demandOptions.value[index].value == campaign.value.demand_source) {
        found = true
        break
      }
    }

    if (!found) {
      //Lấy demand source đầu tiên làm default
      campaign.value.demand_source = demandOptions.value[0].value
    }
  },

  adFormatObj: adFormatObj,

  adFormatsDefault: () => {
    let ad_formats = {} as any

    for (const key in adFormatObj) {
      if (Object.prototype.hasOwnProperty.call(adFormatObj, key)) {
        ad_formats[key] = { status: 'off', floor_price: 0, type: null }

        if (key === 'unlock_content') {
          ad_formats[key].type = 'default'
        }

        if (key === 'display') {
          ad_formats[key].type = 'banner'
        }

        if (adFormatObj[key].dialog && adFormatObj[key].dialog.data) {
          ad_formats[key].dialog = {}

          for (const k in adFormatObj[key].dialog.data) {
            if (
              Object.prototype.hasOwnProperty.call(
                adFormatObj[key].dialog.data,
                k
              )
            ) {
              ad_formats[key].dialog[k] = ''
            }
          }
        }
      }
    }

    return ad_formats
  },

  //Sửa trường hợp json get by id không có data dialog ở reward
  repairMissingRewardDialog: (campaign: Ref) => {
    if (campaign.value.ad_formats) {
      try {
        for (const key in campaign.value.ad_formats) {
          if (
            Object.prototype.hasOwnProperty.call(campaign.value.ad_formats, key)
          ) {
            if (
              adFormatObj[key].dialog &&
              !campaign.value.ad_formats[key].dialog
            ) {
              campaign.value.ad_formats[key].dialog = {}
              for (const k in adFormatObj[key].dialog.data) {
                if (
                  Object.prototype.hasOwnProperty.call(
                    adFormatObj[key].dialog.data,
                    k
                  )
                ) {
                  campaign.value.ad_formats[key].dialog[k] = ''
                }
              }
            }
          }
        }
      } catch {}
    }
  },

  fetchingLandingPage: async (
    opts: {
      q?: string
      info: number
      f?: string
      data?: object
    } = {
      q: '',
      info: 0,
    },
    landingOptions: Ref
  ) => {
    const landingResult = await api_v2.request({
      url: 'filter/landing-page',
      params: {
        q: opts.q,
        f: opts.f,
        info: opts.info,
      },

      data: opts.data,
    })

    if (landingResult?.status) {
      landingOptions.value = landingResult?.data || []
    }
  },

  onLandingChange(value: number, option: any, campaign: Ref) {
    campaign.value.landing_pages = { id: value }
  },

  newGridOptions() {
    return {
      rowHeight: 60,
    }
  },

  optionsMenu() {
    return [
      {
        label: 'Copy Linked Account ID',
        key: 'account_id',
      },
      {
        label: 'Copy Account ID',
        key: 'account_category_id',
      },
      {
        label: 'Open Linked Account',
        key: 'open_account',
      },
      {
        label: 'Open Account Category',
        key: 'open_account_category',
      },
    ]
  },

  findDuplicates(arr: string[]) {
    let seen = new Set()
    let duplicates = [] as string[]

    for (let i = 0; i < arr.length; i++) {
      let trimmedValue = String(arr[i]).trim()

      if (seen.has(trimmedValue)) {
        if (!duplicates.includes(trimmedValue)) {
          duplicates.push(trimmedValue)
        }
      } else {
        seen.add(trimmedValue)
      }
    }

    return duplicates
  },
}
