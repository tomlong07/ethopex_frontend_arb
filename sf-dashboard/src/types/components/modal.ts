import { AIVerifyClass } from './creative-class'

export interface ModalState {
  id?: number
}

export interface ModalStateCreative extends ModalState {
  type?: string
  traffic_source?: string
  modalMenu?: boolean
  creative_id?: number
  ad_type?: string
  ad_id?: string
  ai_verify?: AIVerifyClass
  input_verify?: any
  output_verify?: any
  example_verify?: any
  retry_test?: boolean
}
export interface ModalStateSegment extends ModalState {
  supply_account_id?: number
}
