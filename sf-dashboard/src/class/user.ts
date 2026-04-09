import { ONOFF } from '@/enum/campaign'
import {
  PersonnelType,
  UserStatus,
  BasedInvoiceType,
  PublisherCommission,
} from '@/enum/user'

export class User {
  id?: number
  email?: string
  password?: string
  confirm_password?: string
  status?: UserStatus
  permission?: number
  presenter?: number
  leader?: number
  role_id?: number[]
  first_name?: string
  domain?: string
  last_name?: string
  fou_analytics?: ONOFF
  revenue_sharing_rate: number
  publisher_commission: PublisherCommission
  rate_share?: number
  personnel_type?: PersonnelType
  based_invoice?: BasedInvoiceType
  label?: string | null
  show_name?: string
  invoice?: ONOFF
  admin_manager?: number[]

  constructor(data?: any) {
    // Default values
    this.id = 0
    this.email = ''
    this.password = ''
    this.confirm_password = ''
    this.first_name = ''
    this.last_name = ''
    this.revenue_sharing_rate = 100
    this.publisher_commission = PublisherCommission.YES
    this.personnel_type = PersonnelType.PROBATIONARY_EMPLOYEE
    this.label = null
    this.domain = ''
    this.invoice = ONOFF.ON
    this.fou_analytics = ONOFF.OFF

    if (data) {
      this.normalizeData(data)
    }
  }

  normalizeData(data: any) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]

        switch (key) {
          case 'presenter':
          case 'leader':
            this[key] = element || undefined
            break

          case 'publisher_commission':
            this[key] = element || PublisherCommission.YES
            break

          case 'label':
            this[key] = String(element) || null
            break

          case 'invoice':
            if (element === 'disabled') {
              this[key] = ONOFF.OFF
            } else if (element) {
              this[key] = ONOFF.ON
            }
            break

          default:
            if (element !== undefined && element !== null) {
              ;(this as any)[key] = element
            }
            break
        }
      }
    }
  }

  toPayload(): any {
    const payload: any = { ...this }

    // Convert invoice back to API format
    if (payload.invoice === ONOFF.OFF) {
      payload.invoice = 'disabled'
    } else {
      payload.invoice = ''
    }

    return payload
  }

  //   static createDefault(): User {
  //     return new User()
  //   }

  static fromApiData(data: any): User {
    return new User(data)
  }
}
