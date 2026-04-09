import { defineStore } from 'pinia'

interface RuleData {
  rule_name?: string
  campaign_name?: string
  new_campaign_id?: string
  section_name?: string
  rule_type?: string
  logics?: string
  metrics?: any[]
  [key: string]: any
}
export default defineStore('useModalSatisfyStore', () => {
  const dataRowSatisfy = ref<RuleData | null>(null)
  const campaignHref = ref<string>()
  const showModal = ref(false)

  const isRuleDuplicateCampaign = computed(() => {
    return dataRowSatisfy.value?.rule_type === 'duplicate_campaign'
  })

  return { showModal, dataRowSatisfy, campaignHref, isRuleDuplicateCampaign }
})
