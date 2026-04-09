import { RouteLocationNormalizedLoaded } from 'vue-router/dist/vue-router'

export class ModeClass {
  id: number

  constructor(route: RouteLocationNormalizedLoaded) {
    this.id = Number(route.params.id || 0)
  }

  isAddPage() {
    return this.id === 0
  }

  isEditPage() {
    return this.id !== 0
  }
}

export class ModeClassString {
  id: string
  params: object
  constructor(route: RouteLocationNormalizedLoaded) {
    this.id = String(route.params.id || '')
    this.params = route.query || {}
  }

  isAddPage() {
    return this.id === ''
  }

  isEditPage() {
    return this.id !== ''
  }
}

export class StatusClass {
  name: string //trường này để hiển thị ở BackPage
  isLoading: boolean
  isSubmitBtnLoading: boolean

  constructor(name: string) {
    if (!name) {
      throw new Error('StatusClass: name is required')
    }
    this.name = name || ''
    this.isLoading = true
    this.isSubmitBtnLoading = false
  }
}

export class ModalClass {
  showModal: boolean
  dataModal: string

  constructor() {
    this.showModal = false
    this.dataModal = ''
  }

  ID() {
    return Number(this.dataModal)
  }
}

interface CreateCampaign {
  api?: boolean
  manual?: boolean
  ai?: boolean
}
export interface PermissionManager {
  create_campaign?: CreateCampaign
  verify_ad_creative?: boolean
  prelanding?: boolean
  preview_ad?: boolean
  landing_by_creative?: boolean
  label?: boolean
}
