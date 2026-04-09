import { labelConfigType } from '@/types/components/label'
import { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'
import { ctr_label } from '@/services/ctr_label'
import { FeSettings } from '@/class/fe_settings'

export default defineStore('useLabelManagerDetail', () => {
  const isDisable = ref(false)
  const isLoading = ref(false)
  const isSubmitBtnLoading = ref<boolean>(false)
  const feSettings = ref<FeSettings>()

  const id = computed<number>(() => {
    return Number(window.route.params.id || 0)
  })
  const isAddPage = computed<boolean>(() => id.value === 0)
  const isEditPage = computed<boolean>(() => {
    return !isAddPage.value
  })
  const name = 'label'

  const formData = {
    name: '',
    ads_for: undefined,
    ads_type: null,
    description: '',
    status: 'on',
  }

  const dataConfig = ref<labelConfigType>({
    ...formData,
  })

  const adsTypeOptions = computed<SelectOption[]>(() => {
    if (dataConfig.value.ads_for === 'search') {
      return [{ label: 'search_ads', value: 'search_ads' }]
    }

    switch (dataConfig.value.ads_for) {
      case 'search':
        return [{ label: 'search_ads', value: 'search_ads' }]
      case 'content':
        return [
          { label: 'content_ads1', value: 'content_ads1' },
          { label: 'content_ads2', value: 'content_ads2' },
          { label: 'content_ads3', value: 'content_ads3' },
        ]

      default:
        return []
    }
  })

  const submitForm = async () => {
    if (dataConfig.value.name == '') {
      window.message.error(`Submit failed: Name is required`)
      isSubmitBtnLoading.value = false
      return
    }
    isSubmitBtnLoading.value = true
    if (isAddPage.value) {
      const result = await ctr_label.AddLabel(dataConfig.value)
      if (result?.status) {
        window.message.success(`Add ${name} successfully`)

        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value?.page_list })
        }
      }
    }

    if (isEditPage.value) {
      const result = await ctr_label.EditLabel(id.value, dataConfig.value)
      if (result?.status) {
        window.message.success(`Update ${name} successfully`)
      }
    }
    isSubmitBtnLoading.value = false
  }

  const clearData = () => {
    dataConfig.value = {
      ...formData,
    }
  }
  return {
    name,
    submitForm,
    clearData,
    id,
    isEditPage,
    feSettings,
    isSubmitBtnLoading,
    isAddPage,
    adsTypeOptions,
    dataConfig,
    isDisable,
    isLoading,
  }
})
