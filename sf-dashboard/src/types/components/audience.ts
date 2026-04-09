import { ModalState } from './modal'

export class AudienceStateManager {
  dataModal?: ModalState

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          this[key as keyof this] = element
        }
      }
    }
  }

  isModalMode() {
    return this.dataModal !== undefined
  }

  isNormalMode() {
    return !this.isModalMode()
  }

  id() {
    return this.isModalMode()
      ? Number(this.dataModal?.id || 0)
      : Number(window.route.params.id || 0)
  }

  isAddPage() {
    return this.id() === 0
  }

  isEditPage() {
    return !this.isAddPage()
  }
}
