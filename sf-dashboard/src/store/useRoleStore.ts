import { defineStore } from 'pinia'
import { SelectOption } from 'naive-ui'
import { ctr_roles } from '@/services/ctr_roles'

export default defineStore('useRoleStore', () => {
  const showModal = ref<boolean>(false)
  const accountDemandTo = ref<string[]>([])
  const itemSelected = ref<any[]>([])
  const isSubmitting = ref<boolean>(false)

  const accountDemandOptions = ref<SelectOption[]>([])

  const fetchDemandOptions = async () => {
    const result = await ctr_roles.PreCreate()
    accountDemandOptions.value = result?.data?.account_demand || []
  }

  return {
    showModal,
    accountDemandTo,
    itemSelected,
    isSubmitting,
    accountDemandOptions,
    fetchDemandOptions,
  }
})
