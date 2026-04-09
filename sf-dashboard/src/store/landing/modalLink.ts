import { defineStore } from 'pinia'

export class CrawlCampKeyword {
  landing_id?: number
  user_id?: number
  landing_name?: string
  slug?: string

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

export default defineStore('useModalLandingLink', () => {
  const showModal = ref<boolean>(false)

  const dataLandingLink = ref<CrawlCampKeyword>(new CrawlCampKeyword())

  const openModal = () => {
    showModal.value = true
  }

  const setData = (data: any) => {
    dataLandingLink.value = new CrawlCampKeyword(data)
  }
  return {
    showModal,
    dataLandingLink,

    openModal,
    setData,
  }
})
