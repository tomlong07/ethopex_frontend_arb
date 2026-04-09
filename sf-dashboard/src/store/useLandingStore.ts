import { defineStore } from 'pinia'
import { SelectDataOption } from '@/store/class'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

export default defineStore('useLandingStore', () => {
  const pixelCategoryData = ref<SelectDataOption>(new SelectDataOption())
  const layouts = ref<any[]>([])
  const getNamesByIds = (ids: any[]) => {
    return pixelCategoryData.value.options
      .filter((item) => ids.includes(item.id))
      .map((item) => item.name) as string[]
  }

  const getLayouts = async () => {
    const params = {
      prelander: 'on',
    }
    const result = await ctr_filter_v2.FilterLayout(params)
    layouts.value = result.data
  }

  return {
    pixelCategoryData,
    getNamesByIds,
    getLayouts,
    layouts,
  }
})
