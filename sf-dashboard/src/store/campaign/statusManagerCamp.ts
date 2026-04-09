import { StatusCampManager } from '@/types/components/campaign-v2'
import { defineStore } from 'pinia'

export default defineStore('useStatusCamp', () => {
  const statusData = ref(new StatusCampManager())

  return {
    statusData,
  }
})
