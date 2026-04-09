import { PayloadObjectLabel } from '@/types/components/account-ad'
import { defineStore } from 'pinia'

export default defineStore('useManagerFacebookBusiness', () => {
  const showModal = ref<boolean>(false)
  const dataLabel = ref<{
    id?: string
    labels?: PayloadObjectLabel[]
  }>({})
  const id = ref<string>('')
  const type = ref<string>('')

  const isLabels = computed(() => {
    return type.value === 'labels' || false
  })

  const isAdvertiser = computed(() => {
    return type.value === 'advertiser' || false
  })

  return {
    showModal,
    dataLabel,
    id,
    type,
    isLabels,
    isAdvertiser,
  }
})
