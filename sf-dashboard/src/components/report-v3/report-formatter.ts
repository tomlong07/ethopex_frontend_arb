import { CellComponent } from 'tabulator-tables'
import { Fragment, h, render } from 'vue'

import SectionComponenV2 from '@/components/report-v3/cell/SectionComponenV2.vue'
import AdAccountV2 from '@/components/report-v3/cell/AdAccountV2.vue'
import AdInfoComponent from '@/components/report-v3/cell/AdInfoComponent.vue'
import LandingPageV2 from '@/components/report-v3/cell/LandingPageV2.vue'
import Bidding from '@/components/report-v3/cell/Bidding.vue'
import CPC from '@/components/report-v3/cell/CPC.vue'
import Budget from '@/components/report-v3/cell/Budget.vue'
import PublisherNameV2 from '@/components/report-v3/cell/PublisherNameV2.vue'
import BlockSection from '@/components/report-v3/cell/BlockSection.vue'

import CPCAdjustment from '@/components/report-v3/cell/CPCAdjustment.vue'

import BaseNumber from '@/components/report-v3/cell/BaseNumber.vue'
import PercentOnValue from '@/components/report-v3/cell/PercentOnValue.vue'
import Compare from '@/components/report-v3/cell/Compare.vue'

import SwitchComponentV2 from '@/components/report-v3/cell/SwitchComponentV2.vue'

import {
  buildLinkCampaign,
  createComponent,
} from '@/components/report-v3/report_helpers'
import { ReportColumn } from '@/types/state/report'
import { useReportV2 } from '@/store/report/report-v2'
import { ONOFF, TS } from '@/enum/campaign'

import { buildKeyUnique } from '@/components/report-v3/report_helpers'
import AccountSupplyId from '@/components/report-v3/cell/AccountSupplyId.vue'

import PercentOnValueV2 from './cell/PercentOnValueV2.vue'
import { NCheckbox } from 'naive-ui'

import CampaignActions from './cell/CampaignActions.vue'
import AdGroupId from './cell/AdGroupId.vue'
import { FindBiddingLabel } from '@/labels/campaign'
import CellReportCampaignNameV2 from './cell/CellReportCampaignNameV2.vue'
import CellReportDomain from './cell/CellReportDomain.vue'
import CellReportWhiteList from './cell/CellReportWhiteList.vue'
import ABTestDomain from '../campaign/cell/ABTestDomain.vue'
import DeliveryStatusCell from '../campaign/cell/DeliveryStatusCell.vue'
import Recommendation from '../campaign/cell/Recommendation.vue'
const reportStoreV2 = useReportV2(helper.truePath())()

export const formatterNow = (opts?: ReportColumn) => {
  switch (opts?.KeyFormat()) {
    case 'selected':
      return (cell: CellComponent) => {
        const value = cell.getValue()
        const container = document.createElement('div')
        container.style.height = '100%'
        container.style.position = 'relative'

        const checkbox = h(NCheckbox, {
          checked: value === true,
          style: {
            '--n-color-checked': '#2563eb', // Màu xanh dương blue-600 của Tailwind
            '--n-check-mark-color': '#ffffff', // Màu dấu check trắng
            '--n-border': '1px solid #000000', // Viền đen khi không checked
            '--n-border-radius': '0.25rem', // Bo góc giống Tailwind (rounded)
            '--n-box-shadow-focus': '0 0 0 3px rgba(37, 99, 235, 0.2)', // Hiệu ứng focus giống Tailwind
            '--n-box-shadow-hover': 'none',
            '--n-border-color-hover': 'transparent',
          },
        })

        render(checkbox, container)
        return container.firstElementChild
      }
    case 'campaign':
      return (cell: CellComponent, _formatterParams: any) => {
        const data = cell.getRow().getData()

        const href = buildLinkCampaign(
          data,
          reportStoreV2.timezone,
          reportStoreV2.payload
        )

        let tagInfo

        if (
          data.traffic_source === TS.FACEBOOK &&
          data.campaign_name?.campaign_setup !== ''
        ) {
          const isASC = data.campaign_name?.campaign_setup === 'advantage'
          tagInfo = {
            text: isASC
              ? 'A+SC'
              : helper.capitalizeFirstLetter(
                  data.campaign_name?.campaign_setup
                ),
            type: isASC ? 'info' : 'default',
          }
        }
        const container = document.createElement('div')

        const vnode = h(CellReportCampaignNameV2, {
          name: data?.campaign_name?.name,
          created_by: data?.campaign_name?.created_by,
          href: href,
          tagInfo: tagInfo,
          id: data?.account_supply?.id,
        })

        render(vnode, container)
        return container.firstElementChild
      }

    case 'campaign_id':
      return (cell: CellComponent, _formatterParams: any) => {
        return cell.getRow().getData()?.campaign_name?.id.toString() || ''
      }

    case 'ad_group_id':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')

        const vnode = h(AdGroupId, {
          data: cell.getRow().getData(),
          alertOn: !reportStoreV2?.reportSettingsNew.alertCamp,
        })

        render(vnode, container)
        return container.firstElementChild
      }

    case 'status':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')

        const vnode = h(SwitchComponentV2, {
          status: cell.getValue()?.status,
          campaignId: cell.getRow().getData().campaign_name?.id,
          reportStore: reportStoreV2,
        })

        render(vnode, container)
        return container.firstElementChild
      }

    case 'ab_test_domain':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')

        const campaign_name = cell.getRow().getData().campaign_name
        const vnode = h(ABTestDomain, {
          params: {
            data: {
              id: campaign_name?.id,
              ab_test_domain: campaign_name?.ab_test_domain,
            },
            options: {
              action: opts.action,
            },
          } as any,
          offIcon: true,
        })

        render(vnode, container)
        return container.firstElementChild
      }

    case 'section':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')
        container.className = `flex items-center gap-2 w-full`

        const vnode = h(SectionComponenV2, {
          data: cell.getValue(),
        })

        render(vnode, container)
        return container
      }

    case 'account_demand_id':
      return (cell: CellComponent, _formatterParams: any) => {
        return cell?.getRow().getData()?.account_demand?.name || '-'
      }

    case 'traffic_source_acc_id':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')

        const name = cell?.getValue() || '-'
        const rowData = cell.getRow().getData()

        const href = computed(() => {
          const { start_date, end_date } = reportStoreV2.filter
          const query = new URLSearchParams({
            ad_account: name,
            group: 'campaign',
            start_date: start_date as string,
            end_date: end_date as string,
          })

          if (
            reportStoreV2.reportPermission.autoProfile &&
            reportStoreV2.reportSettingsNew.autoProfile
          ) {
            query.set(
              'profile_id',
              reportStoreV2.reportSettingsNew.autoProfile.toString()
            )
          }

          return `/?${query.toString()}`
        })

        const vnode = h(AdAccountV2, {
          name: name,
          href: href.value,
          link: rowData?.campaign_name?.link_campaign_traffic_source,
        })

        render(vnode, container)
        return container.firstElementChild
      }
    case 'ad_id':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')
        container.className = 'w-full'
        const rowData = cell.getRow().getData()

        const vnode = h(AdInfoComponent, {
          adId: cell.getValue()?.id || '',
          adName: cell.getValue()?.name || '',
          trafficSource: rowData.traffic_source,
          campaignId: rowData.campaign_name?.id,
          status: cell.getValue()?.status || '',
        })

        render(vnode, container)
        return container
      }

    case 'landing_page_id':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')
        container.className = `justify-between gap-2 flex place-items-center w-full`

        const vnode = h(LandingPageV2, {
          data: cell?.getData(),
        })

        render(vnode, container)
        return container
      }

    case 'lp_id':
      return (cell: CellComponent, _formatterParams: any) => {
        return cell.getRow().getData()?.landing_page?.id.toString() || ''
      }

    case 'action_camp':
      return (cell: CellComponent) => {
        const rowData = cell.getRow().getData()
        const container = document.createElement('div')
        render(h(CampaignActions, { rowData }), container)
        return container.firstElementChild
      }

    case 'delivery_status':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')
        const rowData = cell.getRow().getData()

        const vnode = h(DeliveryStatusCell, {
          params: {
            data: rowData.campaign_name,
            value: rowData.campaign_name?.delivery_status || '',
          },
        } as any)

        render(vnode, container)
        return container.firstElementChild
      }

    case 'bidding':
      return (cell: CellComponent) => {
        const container = document.createElement('div')
        const data = cell.getRow().getData()
        const biddingProps = {
          bidding: data?.campaign_name?.bidding,
          campaign_type: data?.campaign_name?.campaign_type,
          traffic_source: data?.traffic_source,
          campaignId: data?.campaign_name?.id,
        }

        render(h(Bidding, biddingProps), container)

        return container.firstElementChild
      }
    case 'cpc':
      return (cell: CellComponent) => {
        const container = document.createElement('div')
        const data = cell.getRow().getData()
        const cpcProps = {
          cpc: data?.campaign_name?.cpc,
          bidding: data?.campaign_name?.bidding,
          campaignId: data?.campaign_name?.id,
          campaign_type: data?.campaign_name?.campaign_type,
          traffic_source: data?.traffic_source,
        }

        render(h(CPC, cpcProps), container)

        return container.firstElementChild
      }

    case 'budget':
      return (cell: CellComponent) => {
        const container = document.createElement('div')
        const data = cell.getRow().getData()
        const budgetProps = {
          budget: data?.campaign_name?.budget,
          budgetString:
            data.traffic_source === TS.FACEBOOK &&
            data.campaign_name?.campaign_budget === ONOFF.OFF &&
            !data?.campaign_name?.budget
              ? 'Adset Budget'
              : '',
        }

        render(h(Budget, budgetProps), container)

        return container.firstElementChild
      }

    case 'ad_group_budget':
      return (cell: CellComponent) => {
        const container = document.createElement('div')
        const data = cell.getRow().getData()
        const budgetProps = {
          budget: data?.ad_group?.budget,
          budgetString:
            data.traffic_source === TS.FACEBOOK &&
            data.campaign_name?.campaign_budget === ONOFF.ON
              ? 'Campaign Budget'
              : '',
        }

        render(h(Budget, budgetProps), container)

        return container.firstElementChild
      }

    case 'publisher':
    case 'manage_id':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')

        const vnode = h(PublisherNameV2, {
          data: cell.getValue() || {},
        })

        render(vnode, container)
        return container.firstElementChild
      }

    case 'block_section':
      return (cell: CellComponent, _formatterParams: any) => {
        return createComponent({
          cell: cell,
          app: BlockSection,
        })
      }

    case 'whitelist':
      return (cell: CellComponent, _formatterParams: any) => {
        const container = document.createElement('div')
        const data = cell.getRow().getData()
        const vnode = h(CellReportWhiteList, {
          referer: data.section?.referer,
          whiteListType: data.white_list?.type,
        })

        render(vnode, container)
        return container.firstElementChild
      }

    case 'cpc_adjustment':
      return (cell: CellComponent, _formatterParams: any) => {
        return createComponent({
          cell: cell,
          app: CPCAdjustment,
        })
      }

    case 'account_supply_id':
      return (cell: CellComponent) => {
        const container = document.createElement('div')
        const rowData = cell.getRow().getData()

        const linkReport = computed(() => {
          const params = new URLSearchParams()

          if (rowData?.account_supply?.id) {
            params.set('account_supply_id', rowData.account_supply.id)
          }

          const profileId = reportStoreV2.reportSettingsNew?.autoProfile
          const hasPermission = reportStoreV2.reportPermission?.autoProfile

          if (hasPermission && profileId) {
            params.set('profile_id', String(profileId))

            params.set('start_date', reportStoreV2.filter.start_date as string)
            params.set('end_date', reportStoreV2.filter.end_date as string)
            params.set('mode', 'profile_cols')
          }

          return `/?${params.toString()}`
        })

        const vnode = h(AccountSupplyId, {
          value: rowData?.account_supply?.account_name,
          linkReport: linkReport.value,
          link: rowData?.campaign_name?.link_campaign_traffic_source,
          dataProfile: window.arb?.user?.dataProfile,
          account_status: rowData?.account_supply?.account_status,
          account_id: rowData?.account_supply?.account_id,
          rowData,
        })

        render(vnode, container)
        return container.firstElementChild
      }

    case 'domain':
      return (cell: CellComponent) => {
        const container = document.createElement('div')
        const rowData = cell.getRow().getData()

        const linkLanding = reportStoreV2.reportPermission?.special
          ? rowData?.campaign_name?.landing_page
          : ''

        const vnode = h(CellReportDomain, {
          value: cell.getValue(),
          linkLanding: linkLanding,
        })

        render(vnode, container)
        return container.firstElementChild
      }

    case 'recommendation':
      return (cell: CellComponent) => {
        const container = document.createElement('div')
        const rowData = cell.getRow().getData()

        const vnode = h(Recommendation, {
          params: { data: rowData.campaign_name || {} } as any,
          wrap: false,
        })

        render(vnode, container)
        return container.firstElementChild
      }

    default:
      //Default của dimension là general
      if (!opts?.IsMetric()) {
        return (cell: CellComponent, _formatterParams: any) => {
          return `<div class="overflow-hidden text-ellipsis ${
            opts?.cssClass
          }">${cell.getValue()}</div>`
        }
        //Dùng html tĩnh cho tối ưu tốc độ, không cần event hay gì phức tạp nên làm thế
      }
      return undefined
  }
}

const formatNumberByValue = (value: any, precision?: number) => {
  const res = helper.formatNumberV2(value, precision)
  if (res === '-') {
    return ''
  }

  return res
}

interface CompareData {
  oldValue: number
  diff: number
  className: string
  text: string
}

const DIFF_THRESHOLD = 0.0001

export const formatForShow = (
  opts: ReportColumn,
  reportDataV2?: any,
  prevReportDataV2?: any
) => {
  return (cell: CellComponent) => {
    const value = cell.getValue()
    if (!value || value === '-') return '-'
    if (value === 0) return ''
    const nodes = []

    // Add compare node if needed
    const compareNode = createCompareNode(
      cell,
      opts,
      reportDataV2,
      prevReportDataV2
    )
    if (compareNode) nodes.push(compareNode)

    nodes.push(createBaseNode(value, opts))

    // Add percent node if needed
    const percentNode = createPercentNode(cell, opts, reportDataV2)
    if (percentNode) nodes.push(percentNode)

    return renderNodes(nodes, !!compareNode) as any
  }
}

const createBaseNode = (value: any, opts: ReportColumn) => {
  const baseNode = h(BaseNumber, {
    data: value || '',
    plus: opts,
  })

  const colorClass = opts.ClassColor(Number(value) < 0)
  if (colorClass) {
    return h('span', { class: colorClass }, [baseNode])
  }

  return baseNode
}

const createPercentNode = (
  cell: CellComponent,
  opts: ReportColumn,
  reportDataV2: any
) => {
  const { percentByMetric, tooltipPercentByMetric } = opts
  if (!percentByMetric || reportDataV2) return null

  const metricData = calculateMetricData(cell, percentByMetric, opts.precision)
  if (!metricData) return null

  //Fix tạm
  if (opts.key === 'cost' || opts.key === 'cost_rt') {
    const rowData = cell.getData() as any

    const dataRenderBidding = rowData?.campaign_name?.bidding
      ? FindBiddingLabel(
          rowData?.campaign_name?.bidding,
          rowData?.traffic_source,
          rowData?.campaign_name?.campaign_type
        )
      : ''

    const dataRenderCPC = rowData?.campaign_name?.cpc
      ? rowData?.campaign_name?.bidding === 'maximizeConversionValue'
        ? helper.floatWithCommas(rowData?.campaign_name?.cpc) + '%'
        : helper.currencyFormatterAuto2(rowData?.campaign_name?.cpc)
      : '-'

    return h(PercentOnValueV2, {
      percent: metricData.percent,
      originalValue: metricData.originalValue,
      tooltipPercentByMetric: tooltipPercentByMetric,
      dataRenderBidding: dataRenderBidding,
      dataRenderCPC: dataRenderCPC,
    })
  }

  return h(PercentOnValue, {
    percent: metricData.percent,
    originalValue: metricData.originalValue,
    tooltipPercentByMetric: tooltipPercentByMetric,
  })
}

const calculateMetricData = (
  cell: CellComponent,
  percentByMetric: string,
  precision?: number
) => {
  const deeps = percentByMetric.split('.')
  if (!deeps?.length) return null

  try {
    const metricValue = helper.getValueByPath(cell.getData(), deeps)
    if (!metricValue) return null

    const rawValue = cell.getValue() as number
    const percentValue = (rawValue / metricValue) * 100
    if (!percentValue) return null

    return {
      percent: `${formatNumberByValue(percentValue, precision)}%`,
      originalValue: formatNumberByValue(metricValue),
    }
  } catch (error) {
    console.error('Error calculating metric:', error)
    return null
  }
}

const createCompareNode = (
  cell: CellComponent,
  opts: ReportColumn,
  reportDataV2: any,
  prevReportDataV2: any
): VNode | null => {
  if (!prevReportDataV2) return null

  const compareData = getCompareData(cell, opts, reportDataV2, prevReportDataV2)
  if (!compareData) return null

  return h(Compare, {
    diff: compareData.diff,
    diffText: formatNumberByValue(compareData.diff, opts.precision),
    className: compareData.className,
    titleNow: compareData.text,
  })
}

const getCompareData = (
  cell: CellComponent,
  opts: ReportColumn,
  reportDataV2: any,
  prevReportDataV2: any
): CompareData | null => {
  const isTotal = !!reportDataV2
  const oldValue = isTotal
    ? getOldTotalValue(cell, prevReportDataV2)
    : getOldRowValue(cell, prevReportDataV2)

  if (oldValue === undefined) return null

  const newValue = cell.getValue()
  const diff = newValue - oldValue

  if (!diff || Math.abs(diff) <= DIFF_THRESHOLD) return null

  return {
    oldValue,
    diff,
    className: getCompareClass(diff, opts),
    text: formatOldValueText(oldValue, opts),
  }
}

const getOldTotalValue = (cell: CellComponent, prevData: any) => {
  return prevData?.total?.[cell.getField()]
}

const getOldRowValue = (cell: CellComponent, prevData: any) => {
  const oldItems = prevData?.items || []
  if (!oldItems.length) return undefined

  const keyUnique = buildKeyUnique(cell.getData())
  const oldItem = oldItems.find(
    (item: any) => buildKeyUnique(item) === keyUnique
  )
  return oldItem?.[cell.getField()]
}

const getCompareClass = (diff: number, opts: ReportColumn): string => {
  if (diff > 0) return opts.IsColorV3() ? 'negative' : 'positive'
  if (diff < 0) return opts.IsColorV3() ? 'positive' : 'negative'
  return ''
}

const formatOldValueText = (oldValue: number, opts: ReportColumn): string => {
  const symbol = opts?.symbol || ''
  const formattedValue = formatNumberByValue(oldValue, opts.precision)
  return opts?.leftSymbol ? symbol + formattedValue : formattedValue + symbol
}

const renderNodes = (
  nodes: VNode[],
  hasCompareNode: boolean = false
): Element => {
  const container = document.createElement('div')
  if (hasCompareNode) {
    container.className = 'flex items-center gap-1'
  }

  if (nodes.length === 1) {
    render(nodes[0], container)
    // Nếu chỉ có 1 node, trả về element con trực tiếp
    return container.firstElementChild || container
  } else {
    // Nếu có nhiều nodes, render với Fragment và trả về container
    render(h(Fragment, {}, nodes), container)
    return container
  }
}
