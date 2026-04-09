import { LandingPageOptionManager } from '@/class/campaign'
import { defineStore } from 'pinia'

export default defineStore('landingOptionStore', () => {
  const manager = ref<LandingPageOptionManager>(new LandingPageOptionManager())
  return {
    manager,
  }
})
