import { URL_UPLOAD } from '@/constants/urls'
import { INEX } from '@/enum/campaign'

export class LocationType {
  value?: string[]
  type?: INEX
  constructor(data?: any) {
    if (data) {
      switch (true) {
        case helper.IsString(data):
          this.value = [data as string]
          break

        case Array.isArray(data):
          this.value = data as string[]
          break

        default:
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              const element = data[key]

              if (!element) continue
              this[key as keyof this] = element
            }
          }
          break
      }
    }

    if (!this.type) this.type = INEX.INCLUDE
    if (!this.value) this.value = []
  }
}
export class CrawlImagePrompt {
  image?: string
  prompt?: number
  api?: string
  ratio?: string[]

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

  KeyUnique() {
    return `${this.image}||${this.prompt ?? ''}||${this.api ?? ''}`
  }

  ImageURL() {
    if (!this.image) return ''
    return this.image?.startsWith('http')
      ? this.image
      : URL_UPLOAD + '/' + this.image.replace(/^\/+/, '')
  }

  IsIncludeRatio(rat: string) {
    if (!this.ratio?.length) return false
    return this.ratio.includes(rat)
  }
}
