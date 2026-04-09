export interface accountType {
  id?: number
  name?: string
  email?: string
  object?: string
  account_ads?: any[]
  client_id?: string
  account_id?: string
  client_secret?: string
  access_token?: string
  pixel_id?: string
  pixel_token?: string
  time_zone?: string
  row_sub_account?: addSubAccountEvents[]
  is_general?: string
  status?: string
  total_account_ads_enabled?: number
  total_account_ads_suspended?: number
  total_account_ads?: number
}

export interface accountCondition {
  account_ids?: string[]
  type?: string[]
  cp_status?: string[]
  list_exclude_scan?: string[]
  labels?: string[]
}

export interface accountTypeGG {
  name: string
  account_id?: string
  object?: string
  time_zone?: string
  account_ads?: addSubAccountEvents[]
  client_id?: string
  client_secret?: string
}
export interface reAccountType {
  client_id: string
  client_secret: string
  access_token: string
}
export interface adsType {
  id: number
  name: string
}

export interface addSubAccountEvents {
  account_id: string
  show_name: string
  domain: string
  account_adsense_accept: string
}
export interface TabAccountMcc {
  name: string | null
  count: number | null
  time_delay: number | null
}

export interface accountMcc {
  name: string
  account_id: number
  mcc_id?: string | null
  status?: string
  error?: string
  create_at?: string
  time_run?: string
}

export class PayloadAddAccountGoogle {
  items: PayloadAddAccountGoogleItem[] = []

  constructor() {
    this.addItems()
  }

  addItems() {
    this.items.push(new PayloadAddAccountGoogleItem())
  }
}

class PayloadAddAccountGoogleItem {
  show_name?: string
  account_id?: string
}
