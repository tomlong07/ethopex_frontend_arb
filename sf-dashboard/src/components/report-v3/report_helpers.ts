import { LandingDialogRP } from '@/enum/landing'
import { useReportV2 } from '@/store/report/report-v2'
import date2 from '@/utils/date2'
import { CellComponent } from 'tabulator-tables'
export default {
  buildLabel: (icon: string, text: string, href: string = '') => {
    if (!text) {
      return ''
    }

    if (href) {
      text = `<a href="${href}" target="_blank">${text}</a>`
    }

    if (!icon) {
      return text
    }

    return `<div class="place-items-center gap-2 flex">${icon}${text}</div>`
  },

  buildTextTooltip: (rowData: any = {}) => {
    const input = [
      `CPC: $${rowData?.campaign_name?.cpc}`,
      `CPA Expected: $${rowData?.campaign_name?.cpa_expected}`,
      `Budget: $${rowData?.campaign_name?.budget}`,
      `Bidding: ${rowData?.campaign_name?.bidding}`,
      `Create Campaign: ${rowData?.campaign_name?.create_campaign}`,
      `Created At: ${rowData?.campaign_name?.created_at}`,
    ]
    return input.join('<br>')
  },

  capitalize: (s: string) => {
    return s && s !== 'N/A' ? s.charAt(0).toUpperCase() + s.slice(1) : s
  },

  getLanguageName: (val: string, languages: any[] = []) => {
    return (
      languages.find((l) => String(l.value) === val || String(l.code2) === val)
        ?.name || val
    )
  },

  buildTextTooltipLanding: function (rowData: any = {}, languages: any[] = []) {
    const landing = rowData?.landing_page
    if (!landing) return 'No landing page data'

    const configs = {
      metadata: [
        { label: 'ID', key: 'id' },
        { label: 'Name', key: 'name' },
        { label: 'Title', key: 'title' },
        { label: 'Content Type', key: 'contentType' },
        { label: 'Demand', key: 'demand' },
        { label: 'Status', key: 'status' },
        { label: 'Language', key: 'language' },
        { label: 'Prelander', key: 'prelander' },
        { label: 'Keywords', key: 'keywords' },
      ],
      sections: [
        { title: 'Description', key: 'description' },
        { title: 'Content', key: 'content' },
      ],
    }

    const formatValue = (val: any) => {
      return val && String(val).trim() ? String(val).trim() : 'N/A'
    }

    const cleanContent = (val: any) => {
      return formatValue(val).replace(/\n\s*\n\s*\n/g, '\n\n')
    }

    const metadataHtml = configs.metadata
      .map((f) => {
        let val = formatValue(landing[f.key])

        if (f.key === 'language') {
          val = this.getLanguageName(val, languages)
        }
        if (['demand', 'status', 'prelander', 'keywords'].includes(f.key)) {
          val = this.capitalize(val)
        }
        if (['contentType'].includes(f.key)) {
          val = val.toUpperCase()
        }

        return LandingDialogRP.row(f.label, val)
      })
      .join('')

    const sectionsHtml = configs.sections
      .map((s) =>
        LandingDialogRP.section(s.title, cleanContent(landing[s.key]))
      )
      .join('')

    return LandingDialogRP.container(metadataHtml, sectionsHtml)
  },
}

export const createComponent = (opts: {
  cell: CellComponent
  components?: { [key: string]: any }
  app: any
  class?: string
  size?: number
  plus?: { [key: string]: any }
  html?: boolean //Option render html raw cho nhẹ hơn
}) => {
  if (!opts || !opts.cell || !opts.app) {
    console.error('Missing required parameters for createComponent')
    return ''
  }

  if (opts.components && !helper.isObject(opts.components)) {
    console.error('Components must be an object')
    return ''
  }
  const wrapper = document.createElement('div')

  if (opts.class) {
    wrapper.className = opts.class
  }

  let props: { [key: string]: any } = { cell: opts.cell }
  if (opts.size) {
    props.size = opts.size
  }

  if (opts.plus) {
    props.plus = opts.plus
  }

  const app = createApp(opts.app, props)

  if (opts.components) {
    for (const key in opts.components) {
      if (Object.prototype.hasOwnProperty.call(opts.components, key)) {
        app.component(key, opts.components[key])
      }
    }
  }

  app.mount(wrapper)

  //Chế độ lấy html raw, ko có event gì cả, cho nhẹ
  if (opts.html) {
    const html = wrapper.outerHTML
    app.unmount() // Dọn dẹp tránh memory leak

    return html
  }
  return wrapper
}

// Used to concatenate uniqueKey in the comparison feature between updates
// Note: if the field is an object, define a unique field to concatenate for comparison (e.g., id)
const dimensions = {
  section: 'id',
  account_demand: 'id',
  campaign_name: 'id',
  publisher: 'email',
  date: '',
  traffic_source: '',
  demand_source: '',
  keyword: '',
  layout_id: '',
  landing_page: 'id',
  manage_id: 'id',
  ad_group_id: '',
  ad_id: '',
  geo: '',
  device: '',
  ad_format: '',
  account_supply_id: '',
  traffic_source_acc_id: '',
  domain: '',
  link_type: '',
  keyword_set_type: '',
  label: '',
} as { [key: string]: string }

// Used to concatenate uniqueKey in the comparison feature between updates
// Note: if the field is an object, define a unique field to concatenate for comparison (e.g., id)
export const buildKeyUnique = (objectData: any) => {
  let keyUniqueForThisRow = ''

  for (const key in objectData) {
    if (Object.prototype.hasOwnProperty.call(objectData, key)) {
      if (dimensions.hasOwnProperty(key)) {
        if (helper.isObject(objectData[key])) {
          keyUniqueForThisRow += String(
            objectData[key][dimensions[key]] == null
              ? '-'
              : objectData[key][dimensions[key]]
          )
        } else {
          keyUniqueForThisRow += String(
            objectData[key] == null ? '-' : objectData[key]
          )
        }
      }
    }
  }

  return keyUniqueForThisRow
}

export const buildLinkCampaign = (
  data: any,
  timeZone: string,
  payload?: any
) => {
  const reportStoreV2 = useReportV2(helper.truePath())()
  const query = new URLSearchParams()
  query.set('page', '1')

  if (reportStoreV2.reportSettingsNew.autoSaveReport) {
    if (payload.group_by && payload.group_by.length > 0) {
      query.set('groupby', payload.group_by.join(','))
    }

    if (payload.cols && payload.cols.length > 0) {
      query.set('cols', payload.cols.join(','))
    }
  }

  if (reportStoreV2.reportSettingsNew.campaignViewMode) {
    const [startDate, endDate] = reportStoreV2.getDateRange()

    query.set('start_date', startDate as string)
    query.set('end_date', endDate as string)
    query.set('campaigns', data?.campaign_name?.id.toString())

    query.set('sort', 'date desc')

    //Nếu ko có autoProfile lấy profile đang chọn
    let profileId = reportStoreV2.reportPermission?.autoProfile
      ? reportStoreV2.reportSettingsNew?.autoProfile
      : null

    if (profileId === -2) profileId = 0

    let profileExists = reportStoreV2.profileOptions.find(
      (el) => el.id === profileId
    )

    if (!profileExists) {
      profileId = reportStoreV2.profileSelectedId
      profileExists = reportStoreV2.profileOptions.find(
        (el) => el.id === profileId
      )
    }

    if (profileId && profileExists) {
      query.set('profile_id', String(profileId))

      if (reportStoreV2.reportSettingsNew.groupBy === 'date') {
        query.set('groupPlus', 'date')
      }
    } else {
      if (reportStoreV2.reportSettingsNew.groupBy === 'date') {
        query.set('group', 'date,campaign')
      }
    }
  } else {
    //Last 7 days include today
    query.set('start_date', date2.last6Days(timeZone))

    query.set('end_date', date2.today(timeZone))
    query.set('sort', 'date desc')

    query.set('campaigns', data?.campaign_name?.id.toString())
    query.set('group', 'date,campaign')

    let profileId = reportStoreV2.profileSelectedId
    if (profileId === -2) profileId = 0

    const profileExists = reportStoreV2.profileOptions.find(
      (el) => el.id === profileId
    )

    if (profileId && profileExists) {
      query.set('profile_id', String(profileId))
    }
  }

  return `?${query.toString()}`
}
