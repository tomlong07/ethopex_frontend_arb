import { defineStore } from 'pinia'

export default defineStore('useDomainManager', () => {
  const showModal = ref<boolean>(false)

  const labelOptions = ref<string[]>([])

  const dataLabels = ref<{
    id?: string
    labels?: string[]
  }>({})

  return {
    showModal,
    labelOptions,
    dataLabels,
  }
})
