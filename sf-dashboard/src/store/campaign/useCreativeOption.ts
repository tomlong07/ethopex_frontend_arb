import { CreativeOptionManager } from '@/class/campaign'
import { defineStore } from 'pinia'

export default defineStore('creativeOptionStore', () => {
  const manager = ref<CreativeOptionManager>(new CreativeOptionManager())
  return {
    manager,
  }
})
