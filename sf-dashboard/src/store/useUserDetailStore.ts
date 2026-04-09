import { defineStore } from 'pinia'
import { User } from '@/class/user'
import { ctr_user } from '@/services/ctr_user'

interface AsyncSettings {
  paymentSettings?: boolean
  updateRole?: boolean
  updateManager?: boolean
}

export const useUserDetailStore = defineStore('userDetail', () => {
  // State
  const user = ref<User>(new User())
  const isLoading = ref<boolean>(false)
  const isSubmitBtnLoading = ref<boolean>(false)
  const infomationError = ref<any>({})
  const asyncSettings = ref<AsyncSettings>({})

  // Getters
  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []

    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)
  })

  const isAddMode = computed(() => user.value.id === 0)
  const isEditMode = computed(() => !isAddMode.value)

  // Actions
  const fetchUser = async (id: number) => {
    isLoading.value = true
    try {
      const result = await ctr_user.GetByID({ id })
      if (result?.data) {
        user.value = User.fromApiData(result.data)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      isLoading.value = false
    }
  }

  const duplicateUser = async (id: number) => {
    isLoading.value = true
    try {
      const result = await ctr_user.GetByID({ id })
      if (result?.data) {
        const duplicated = User.fromApiData(result.data)
        duplicated.id = 0
        user.value = duplicated
      }
    } catch (error) {
      console.error('Error duplicating user:', error)
    } finally {
      isLoading.value = false
    }
  }

  const submitForm = async (feSettingsPageList?: string) => {
    isSubmitBtnLoading.value = true
    infomationError.value = {}

    try {
      const payload = user.value.toPayload()

      if (isAddMode.value) {
        const result = await ctr_user.Add(payload)
        if (result.status) {
          window.message.success('Submit success!')
          if (feSettingsPageList) {
            window.router.push({ path: feSettingsPageList })
          }
        } else {
          infomationError.value = result
        }
      } else {
        const result = await ctr_user.Edit(payload)
        if (result.status) {
          window.message.success('Submit success!')
        } else {
          infomationError.value = result
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      isSubmitBtnLoading.value = false
    }
  }

  const resetUser = () => {
    user.value = new User()
    infomationError.value = {}
  }

  const setAsyncSettings = (settings: AsyncSettings) => {
    asyncSettings.value = settings
  }

  return {
    user,
    isLoading,
    isSubmitBtnLoading,
    infomationError,
    asyncSettings,

    showErr,
    isAddMode,
    isEditMode,

    fetchUser,
    duplicateUser,
    submitForm,
    resetUser,
    setAsyncSettings,
  }
})
