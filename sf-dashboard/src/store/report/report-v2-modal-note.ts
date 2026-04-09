import { ctr_logging } from '@/services/ctr_logging'
import { defineStore } from 'pinia'

export default defineStore('useReportNotes', () => {
  const showModal = ref<boolean>(false)
  const isSubmitting = ref<boolean>(false)
  const campaignId = ref<number>(0)
  const note = ref<string>('')

  const submitForm = async () => {
    if (!campaignId.value) return
    try {
      isSubmitting.value = true

      // Simulate an API call
      const result = await ctr_logging.SaveNote({
        object: 'campaign',
        note: note.value,
        object_id: campaignId.value,
      })

      if (result?.status) {
        window.message.success('Success')
        showModal.value = false
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    showModal,
    isSubmitting,
    campaignId,
    note,

    submitForm,
  }
})
