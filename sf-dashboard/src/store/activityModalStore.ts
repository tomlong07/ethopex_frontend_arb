import { defineStore } from 'pinia'

export const useActivityModal = defineStore('useActivityModal', () => {
  const showModal = ref(false)
  const readySetting = ref(false)

  const settingsNow = ref({ language: 'utc', mode: 'full' })

  const isModeImportant = ref(true)

  const submitForm = () => {
    localStorage.setItem(
      'activityModalStore',
      JSON.stringify(settingsNow.value)
    )
    showModal.value = false
    window.location.reload()
  }

  const fetchSettings = () => {
    const settings = localStorage.getItem('activityModalStore')

    if (settings) {
      settingsNow.value = JSON.parse(settings)

      if (!settingsNow.value.language || settingsNow.value.language === 'en') {
        settingsNow.value.language = 'utc'
      }
      if (settingsNow.value.language === 'vi') {
        settingsNow.value.language = '+7'
      }
      if (!settingsNow.value.mode) {
        settingsNow.value.mode = 'full'
      }
    }

    isModeImportant.value = settingsNow.value.mode === 'important'

    readySetting.value = true
  }

  return {
    showModal,
    settingsNow,
    readySetting,

    isModeImportant,

    submitForm,
    fetchSettings,
  }
})
