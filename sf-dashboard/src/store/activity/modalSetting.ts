import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ISettingsNow } from '@/types/components/activity'
import { SelectOption } from 'naive-ui'

export const useModalSettingStore = defineStore('useModalSettingStore', () => {

  // !! State
  const showModal = ref<boolean>(false)
  const readySetting = ref<boolean>(false)
  const isModeImportant = ref<boolean>(true)
  const languageOptions: SelectOption[] = [
    { label: 'UTC', value: 'utc' },
    { label: 'GMT+7', value: '+7' },
  ]

  const modeOptions: SelectOption[] = [
    { label: 'Important', value: 'important' },
    { label: 'Full', value: 'full' },
  ]

  const settingsNow = ref<ISettingsNow>({
    language: 'utc',
    mode: 'full',
  })


  // !! Actions
  const fetchSettings = (): void => {
    const savedSettings = localStorage.getItem('activityModalStore')

    if (savedSettings) {
      settingsNow.value = { ...settingsNow.value, ...JSON.parse(savedSettings) }
    }

    const settings = settingsNow.value 

    if (!settings.language || settings.language === 'en') {
      settings.language = 'utc'
    }

    if (settings.language === 'vi') {
      settings.language = '+7'
    }

    if (!settings.mode) {
      settings.mode = 'full'
    }

    isModeImportant.value = settings.mode === 'important'
    readySetting.value = true
  }


  const submitForm = (): void => {
    localStorage.setItem(
      'activityModalStore',
      JSON.stringify(settingsNow.value)
    )
    showModal.value = false
    window.location.reload()
  }

  return {
    showModal,
    settingsNow,
    readySetting,
    languageOptions,
    modeOptions,
    isModeImportant,

    submitForm,
    fetchSettings,
  }
})
