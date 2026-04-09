export interface profileType {
  email: string
  first_name: string
  last_name: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  phone_number: string
  key_api?: string
}

export interface billingType {
  method: string
  paypal_email?: string
  payoneer_email?: string
  pingpong_email?: string
  cryptocurrency?: string
  wallet_id?: string
  beneficiary_name?: string
  bank_name?: string
  bank_address?: string
  bank_account_number?: string
  bank_routing_number?: string
  bank_iban_number?: string
  swift_code?: string
  ifsc_code?: string
}

export interface userImport {
  id?: number
  email?: string
  password?: string
  confirm_password?: string
  status?: number
  permission?: number
  presenter?: number
  leader?: number
  role_id?: number[]
  first_name?: string
  domain?: string
  last_name?: string
  revenue_sharing_rate: number
  publisher_commission: string
  rate_share?: number
  personnel_type?: string
  based_invoice?: string
  label?: string | null
  show_name?: string
  invoice?: string
  admin_manager?: number[]
}

export interface passwordType {
  old_password: string | null
  new_password: string | null
  confirm_password: string | null
}
