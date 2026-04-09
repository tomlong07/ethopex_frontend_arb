import { userImport } from '@/types/components/user'
import { defineStore } from 'pinia'

export const useShowNameStore = defineStore('useShowNameStore', () => {
  const showModal = ref(false)
  const user = ref<userImport>({
    show_name: '',
  } as userImport)
  return {
    showModal,
    user,
  }
})
