import { CDN_IMAGE_MINIO_S3_ICON, ICON_VERSION } from '@/constants/urls'
import api_v2 from '@/core/api_v2'
import { PURCHASE_VALUE_TYPE } from '@/enum/campaign'
import {
  CreativeOptionInterface,
  LandingOptionInterface,
} from '@/interface/campaign'
import { ctr_creative } from '@/services/ctr_creative'
import { SelectOption } from 'naive-ui'

export class LandingPageOptionManager {
  options: SelectOption[] = []
  loading: boolean = false

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          this[key as keyof this] = element
        }
      }
    }
  }

  async fetchOptions(opts?: LandingOptionInterface) {
    this.loading = true

    try {
      const params = {
        q: opts?.q,
        f: opts?.f,
        nf: '0',
        id: opts?.id,
      }
      const data = {
        filter: {
          demand_source: opts?.demand_source,
          prelander: opts?.prelander,
        },
      }
      const result = await api_v2.request({
        url: 'filter/landing-page',
        params,
        data,
      })

      this.options = (result?.data || []).map((el: any) => ({
        ...el,
        value: el.value,
        label: `${el.value} - ${el.label}`,
      }))
    } finally {
      this.loading = false
    }
  }
}

export class CreativeOptionManager {
  options: SelectOption[] = []
  loading: boolean = false

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          this[key as keyof this] = element
        }
      }
    }
  }

  async fetchOptions(opts?: CreativeOptionInterface) {
    if (!opts?.traffic_source) return

    this.loading = true

    try {
      const result = await ctr_creative.GetAllCreative({
        params: {
          id: opts.id,
          q: opts.q,
          ts: opts.traffic_source,
          info: '1',
        },
      })

      this.options = result?.data?.creatives || []
    } finally {
      this.loading = false
    }
  }
}

export class IconTSInfo {
  url: string = ''
  size: string = '28'
  tail: string = 'svg'

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          this[key as keyof this] = element
        }
      }
    }
  }

  URL() {
    return `${CDN_IMAGE_MINIO_S3_ICON}/${this.url}.${this.tail}?v=${ICON_VERSION}`
  }
}

export class PurchaseValue {
  purchase_value_type?: PURCHASE_VALUE_TYPE
  value?: number
  conversions?: number

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          this[key as keyof this] = element
        }
      }
    }

    if (!this.purchase_value_type) {
      this.purchase_value_type = PURCHASE_VALUE_TYPE.NONE
    }
  }

  IsRPC() {
    return this.purchase_value_type === PURCHASE_VALUE_TYPE.RPC
  }

  IsFixed() {
    return this.purchase_value_type === PURCHASE_VALUE_TYPE.FIXED
  }
}
