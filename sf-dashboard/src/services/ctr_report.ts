import api_v2 from '@/core/api_v2'
import { reportMock } from '@/data/reportMock'
import { AxiosRequestConfig } from 'axios'

export const ctr_report = {
  Report: async (payload: any, signal?: any) => {
    return (
      (await api_v2.request({ url: 'report', data: payload, signal })) || {}
    )
  },

  ReportNew: async (payload: any, url?: string) => {
    if (window.arb.debug) {
      return reportMock
    } else {
      const result = await api_v2.request({ url: url, data: payload })

      return result || {}
    }
  },

  BlockSection: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/block-section',
        data: payload,
      })) || {}
    )
  },

  ChangeBidSection: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/change-bid-section',
        data: payload,
      })) || {}
    )
  },

  TimeZone: async () => {
    return (
      (await api_v2.request({
        url: 'report/time-zone',
      })) || {}
    )
  },

  ReportProfiles: async (path: string) => {
    return (
      (await api_v2.request({
        url: `report/profiles?path=${path}`,
      })) || {}
    )
  },

  CreateReportProfile: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/profile/create',
        data: payload,
      })) || {}
    )
  },

  UpdateReportProfile: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/profile/update',
        data: payload,
      })) || {}
    )
  },

  DeleteReportProfile: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/profile/delete',
        data: payload,
      })) || {}
    )
  },

  GetListFaceBookAds: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/list-ads-fb',
        data: payload,
      })) || {}
    )
  },

  GetLinkPreviewTaboola: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/link-preview-ads-taboola',
        data: payload,
      })) || {}
    )
  },

  GetLinkPreviewAds: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/link-preview-ads-fb',
        data: payload,
      })) || {}
    )
  },

  SearchType: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/report/search-type',
        data: payload,
      })) || {}
    )
  },

  GetKeyWordPlan: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/report/get_keyword_plan',
        data: { data: payload },
      })) || {}
    )
  },

  ReportPrefetch: async () => {
    return (
      (await api_v2.request({
        url: 'report/prefetch',
      })) || {}
    )
  },

  ReportGetData: async (linkAjax?: string, payload?: any) => {
    if (!linkAjax) return
    return (
      (await api_v2.request({
        url: linkAjax,
        method: payload ? 'POST' : 'GET',
        data: payload ? payload : null,
      })) || {}
    )
  },

  ReportGetDataV2: async (linkAjax?: string, params?: any) => {
    if (!linkAjax) return
    return (
      (await api_v2.request({
        url: linkAjax,
        method: 'GET',
        params,
      })) || {}
    )
  },

  Ajax: async (configs: AxiosRequestConfig) => {
    return (await api_v2.request(configs)) || {}
  },

  ReportOpts: async (payload: any) => {
    return (
      (await api_v2.request({
        url: 'report/opts',
        data: payload,
      })) || {}
    )
  },

  ReportChartSettings: async () => {
    return (
      (await api_v2.request({
        url: '/report/chart-settings',
      })) || {}
    )
  },

  SavePlk: async (data: any) => {
    return (
      (await api_v2.request({
        url: '/report/key',
        data: data,
      })) || {}
    )
  },

  FetchCols: async () => {
    return (
      (await api_v2.request({
        url: 'report/cols',
      })) || {}
    )
  },
  GetTopMetric: async () => {
    return (
      (await api_v2.request({
        url: '/report/top-list/metrics',
      })) || {}
    )
  },

  GetRPMByDomain: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/report/get-rpm-by-domain',
        data: payload,
      })) || {}
    )
  },

  ReportCampaignSettings: async () => {
    return (
      (await api_v2.request({
        url: '/campaign/settings',
      })) || {}
    )
  },

  MoreSettingOverview: async (url: string) => {
    if (!url) return
    return (
      (await api_v2.request({
        url: `/menu-more-settings${url}`,
      })) || {}
    )
  },
}
