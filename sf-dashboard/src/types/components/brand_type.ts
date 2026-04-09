export interface BrandType {
  id?: number
  brand_name?: string
  logo?: string
  business_name?: string
  short_brand?: string
  home_page?: string
  contact_page?: string
  created_at?: string
}

export class BrandCls {
  id?: number
  brand_name?: string
  logo?: string
  business_name?: string
  short_brand?: string
  home_page?: string
  contact_page?: string
  created_at?: string

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }
}
