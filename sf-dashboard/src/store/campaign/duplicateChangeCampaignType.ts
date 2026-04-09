import { defineStore } from 'pinia'

export default defineStore('duplicateChangeCampaignType', () => {
  const showModal = ref<boolean>(false)
  const campaignOriginal = ref(0)

  return {
    showModal,
    campaignOriginal,
  }
})
