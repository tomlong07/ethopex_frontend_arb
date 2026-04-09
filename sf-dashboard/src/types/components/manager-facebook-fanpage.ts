export class facebookFanpageType {
  id?: number
  status?: string
  name?: string
  show_name?: string
  user_id?: number
  link?: string
  post_id?: string
  traffic_source?: string

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }

      if (!data.status) {
        this.status = 'off'
      }
    } else {
      this.status = 'on'
    }
  }
}

export class facebookFanpageTypeArray {
  items: facebookFanpageType[]

  constructor(data?: any) {
    this.items = []
    if (data) {
      this.items = [new facebookFanpageType(data)]
    } else {
      //default cho trường hợp add
      this.items?.push(new facebookFanpageType())
    }
  }

  addNewFB() {
    this.items?.push(
      new facebookFanpageType({ traffic_source: 'facebook', status: 'on' })
    )
  }
}
