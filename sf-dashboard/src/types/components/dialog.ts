interface AdFormatsOptions {
  hasDialog?: boolean
  hasType?: boolean
  type?: string
  status?: string
  floorPrice?: number
}

export class AdFormats {
  status: string
  floor_price: number
  type?: string | null
  dialog?: Dialog

  constructor(data?: any) {
    // Set default values
    this.status = 'off'
    this.floor_price = 0
    this.type = 'banner'

    if (data) {
      // object options -> trường hợp ở campaign để tránh gửi payload thừa (type, dialog)
      if (data.hasDialog !== undefined || data.hasType !== undefined) {
        const {
          hasDialog = false,
          hasType = false,
          type = 'banner',
          status = 'off',
          floorPrice = 0,
        } = data as AdFormatsOptions

        this.status = status
        this.floor_price = floorPrice

        if (hasType) {
          this.type = type
        } else {
          this.type = null
        }

        if (hasDialog) {
          this.dialog = {}
        }
      } else {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key]
            switch (key) {
              case 'status':
                this.status = typeof value === 'string' ? value : 'off'
                break
              case 'floor_price':
                this.floor_price = typeof value === 'number' ? value : 0
                break
              case 'type':
                this.type = value
                break
              case 'dialog':
                this.dialog = value
                break
              default:
                break
            }
          }
        }
      }
    }
  }
}

export interface Dialog {
  button_text?: string
  call_to_action?: string
  heading?: string
  image?: string
  subheading?: string

  label_scholarship?: string
  label_suggested?: string
  location?: string
  time?: number
  deadline_message?: string
}
export class UnlockContentConfig {
  status: string
  floor_price: number
  type?: string
  dialog: Dialog

  constructor(data?: Partial<AdFormats>) {
    this.status = 'off'
    this.floor_price = 0
    this.dialog = {}
    this.type = 'default'

    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key as keyof typeof data]

          switch (key) {
            case 'status':
              this.status = (data.status as any) === 'on' ? 'on' : 'off'
              break

            case 'floor_price':
              this.floor_price = value as number
              break

            case 'dialog':
              this.dialog = { ...(value as Dialog) }
              break

            case 'type':
              this.type = value as string
              break

            case 'button_text':
              this.dialog[key] = value as string
              break

            default:
              break
          }
        }
      }
    }
  }
}
