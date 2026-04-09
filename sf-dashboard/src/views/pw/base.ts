export class AsyncSettings {
  admInfo?: AdminInfo

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

interface AdminInfo {
  hName: string
  hValue: string
  hLink: string
}
