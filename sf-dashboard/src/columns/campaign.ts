import { TS } from '@/enum/campaign'
import ActionPixel from '@/components/campaign/cell/ActionPixel.vue'
import ActionTrigger from '@/components/campaign/cell/ActionTrigger.vue'
import AdsStatus from '@/components/campaign/cell/AdsStatus.vue'
import AdsURL from '@/components/campaign/cell/AdsURL.vue'
import AdsImage from '@/components/campaign/cell/AdsImage.vue'
import ErrorAds from '@/components/campaign/cell/ErrorAds.vue'
import PocPocCreativeURL from '@/components/campaign/cell/pocpoc/CreativeURL.vue'
import PixelStatus from '@/components/campaign/cell/PixelStatus.vue'

export function colDefsByTs(ts: TS | string) {
  const commonConfig = {
    minWidth: 80,
    width: 100,
    maxWidth: 120,
    resizable: false,
    suppressSizeToFit: true,
  }
  switch (ts) {
    case TS.FACEBOOK:
    case TS.MEDIAGO:
    case 'general':
    case TS.NEWSBREAK:
    case TS.MGID:
    case TS.ZEMANTA:
      return [
        {
          headerName: 'ID',
          field: 'id',
        },
        {
          headerName: 'URL(required)',
          field: 'url',
          cellRenderer: (params: any) => {
            const a = document.createElement('a')
            a.href = params.value
            a.target = '_blank'
            a.textContent = params.value // 👈 render đúng literal, không parse entity
            return a
          },
        },
        {
          headerName: 'STATUS',
          field: 'status',
        },
        {
          headerName: 'TITLE',
          field: 'title',
        },
        {
          headerName: 'SITE NAME',
          field: 'site_name',
        },
        {
          headerName: 'IMAGE URL',
          field: 'image_url',
        },
      ]

    case TS.GOOGLE:
    case TS.QUANTUMDEX:
    case TS.REVCONTENT:
      return [
        {
          headerName: 'ID',
          field: 'id',
        },
        {
          headerName: 'URL(required)',
          field: 'url',
          cellRenderer: AdsURL,
        },
        {
          headerName: 'STATUS',
          field: 'status',
          cellRenderer: AdsStatus,
        },
        {
          headerName: 'TITLE',
          field: 'title',
        },
        {
          headerName: 'SITE NAME',
          field: 'site_name',
        },
        {
          headerName: 'IMAGE URL',
          field: 'image_url',
          cellRenderer: AdsImage,
        },
      ]

    case TS.TABOOLA:
    case TS.SNAPCHAT:
      return [
        {
          headerName: 'ID',
          field: 'id',
        },
        {
          headerName: 'URL(required)',
          field: 'url',
          cellRenderer: AdsURL,
          flex: 0.2,
        },
        {
          headerName: 'STATUS',
          field: 'status',
          ...commonConfig,
          cellRenderer: AdsStatus,
          flex: 0.1,
        },
        {
          headerName: 'ERROR MESSAGE',
          field: 'error',
          ...commonConfig,
          cellRenderer: ErrorAds,
          flex: 0.1,
        },
        {
          headerName: 'TITLE',
          field: 'title',
          flex: 0.2,
        },
        {
          headerName: 'SITE NAME',
          field: 'site_name',
          flex: 0.2,
        },
        {
          headerName: 'IMAGE URL',
          field: 'image_url',
          cellRenderer: AdsImage,
          flex: 0.2,
        },
      ]

    case TS.OUTBRAIN:
      return [
        {
          headerName: 'ID',
          field: 'id',
        },
        {
          headerName: 'URL(required)',
          field: 'url',
          cellRenderer: (params: any) => {
            // put the value in bold
            return `<a href="${params.value}" target="_blank">${params.value}</a>`
          },
        },
        {
          headerName: 'STATUS',
          field: 'status',
        },
        {
          headerName: 'ERROR MESSAGE',
          field: 'error',
          cellRenderer: ErrorAds,
        },
        {
          headerName: 'TITLE',
          field: 'title',
        },
        {
          headerName: 'SITE NAME',
          field: 'site_name',
        },
        {
          headerName: 'IMAGE URL',
          field: 'image_url',
        },
      ]

    case TS.POCPOC:
      return [
        {
          headerName: 'ID',
          field: 'id',
        },
        {
          headerName: 'URL(required)',
          field: 'url',
          cellRenderer: PocPocCreativeURL,
        },
        {
          headerName: 'STATUS',
          field: 'status',
        },
        {
          headerName: 'ERROR MESSAGE',
          field: 'error',
          cellRenderer: ErrorAds,
        },
        {
          headerName: 'TITLE',
          field: 'title',
        },
        {
          headerName: 'SITE NAME',
          field: 'site_name',
        },
        {
          headerName: 'IMAGE URL',
          field: 'image_url',
          cellRenderer: AdsImage,
        },
      ]
  }

  return []
}

export const columnsDefTriggers = [
  {
    headerName: 'ID',
    field: 'id',
    flex: 0.3,
  },
  {
    headerName: 'TRIGGERS',
    field: 'trigger',
    flex: 0.3,
  },
  {
    headerName: 'ACTION',
    field: 'action',
    cellRenderer: ActionTrigger,
    flex: 0.3,
  },
]

export const columnsDefPixel = [
  {
    headerName: 'ID',
    field: 'id',
    flex: 0.2,
  },
  {
    headerName: 'PIXEL',
    field: 'pixel',
    flex: 0.4,
  },

  {
    headerName: 'Status',
    field: 'status',
    flex: 0.2,
    cellRenderer: PixelStatus,
  },
  {
    headerName: 'ACTION',
    field: 'action',
    cellRenderer: ActionPixel,
    flex: 0.2,
  },
]
