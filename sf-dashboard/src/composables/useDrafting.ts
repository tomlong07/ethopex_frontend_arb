import { KEY_STORAGE } from '@/constants/app'
import { ExcludePath } from '@/definitions'
import storage from '@/plugins/storage'
import useModalStore from '@/store/useModalStore'
import { FreezeClass } from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
export function useDrafting(keyPage: string) {
  const keyStorage = KEY_STORAGE
  const result = ref({})

  const excludePath = computed(() => {
    return ExcludePath.some((item) => item === window.location.pathname)
  })

  const FreezeData = helper.deepFreeze(
    new FreezeClass(window.route)
  ) as FreezeClass

  function makeStorageKey() {
    return `${keyStorage}_${window.location.pathname}`
  }
  const modalStore = useModalStore()
  const toggle = () => {
    modalStore.toggle()
  }

  const hasSubmit = () => {
    const saved = localStorage.getItem(makeStorageKey())
    if (saved) {
      result.value = JSON.parse(saved)
    }
    modalStore.result = result.value || {}
    modalStore.cancel()
    return result.value || {}
  }

  const remove = () => {
    const key = makeStorageKey()
    localStorage.removeItem(key)
    modalStore.cancel()
  }

  const isOpen = computed(() => {
    return modalStore.showModal || false
  })

  const openModalConfirm = () => {
    const saved = localStorage.getItem(makeStorageKey())

    if (FreezeData.isAddPage() && saved) {
      modalStore.key = makeStorageKey()
      toggle()
    }
  }

  const initial = () => {
    if (excludePath.value || !keyPage) return
    modalStore.showModal = false
    modalStore.result = {}
    result.value = {}
    openModalConfirm()
  }

  initial()

  const draftingData = (data?: Ref) => {
    watch(
      () => data?.value,
      debounceV2((v) => {
        if (v && FreezeData.isAddPage()) {
          storage.clearOldStorage()
          localStorage.setItem(makeStorageKey(), JSON.stringify(v))
        }
      }, 200),
      { deep: true }
    )
  }

  return { toggle, remove, isOpen, draftingData, result, hasSubmit }
}
