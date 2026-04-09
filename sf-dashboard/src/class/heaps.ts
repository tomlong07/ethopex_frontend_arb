export class HeapsData {
  data: Record<string, Record<string, Heap[]>> = {}

  constructor(raw?: any) {
    const source = raw?.data ?? raw
    if (!source || typeof source !== 'object') return

    Object.entries(source).forEach(([groupName, apps]) => {
      this.data[groupName] = {}

      Object.entries(apps as Record<string, any[]>).forEach(
        ([appName, items]) => {
          this.data[groupName][appName] = (items || []).map(
            (item) => new Heap(item)
          )
        }
      )
    })
  }
}

export class Heap {
  name: string = ''
  url: string = ''

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
}
