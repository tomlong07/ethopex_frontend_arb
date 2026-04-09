export class ResponseRuleCheckCamp {
  items: any[] = []
  message: string = ''
  success: boolean = false

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

  TabName() {
    if (!this.items?.length) return 'Item'
    const rule_type = this.items[0]?.rule_type
    switch (true) {
      case rule_type.includes('_campaign'):
        return 'Campaign'

      case rule_type.includes('ad_group'):
        return 'Ad Group'
      case rule_type.includes('section'):
        return 'Section'
      case rule_type.includes('_ad'):
        return 'Ad'
    }

    return 'Item'
  }
}
