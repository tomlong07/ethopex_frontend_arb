import { defineStore } from 'pinia'
import {
  pixelManagerConfigType,
  pixelEvents,
} from '@/types/components/pixel_manager'
import { SelectOption } from 'naive-ui'
import Checkmark from '@/assets/icons/Checkmark.vue'
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'
import Close from '@/assets/icons/Close.vue'
export default defineStore('usePixelManagerDetail', () => {
  // Dữ liệu mặc định cho pixelConfig
  const newPixelEvent = () => {
    return {
      action: [],
      properties: [],
      event: null,
    } as pixelEvents
  }

  const getDefaultPixelConfig = (): pixelManagerConfigType => ({
    name: '',
    status: 'on',
    traffic_source: null,
    pixel_id: '',
    pixel_token: '',
    pixel_events: [newPixelEvent()],
    publisher: null,
  })

  const pixelConfig = ref<pixelManagerConfigType>(getDefaultPixelConfig())
  const id = computed<number>(() => Number(window.route.params.id || 0))
  const name = `pixel manager`
  const isLoading = ref(false)
  const isDisable = ref(false)
  const isLoadingPixels = ref(false)
  const isDisablePixelId = ref(false)
  const isDisablePixelToken = ref(false)
  const isDisableTrafficSource = ref(false)

  const isTrafficLoading = ref(false)
  const eventType = ref<{ value: string; name: string }[]>([])
  const trafficSource = ref<{ value: string; name: string }[]>([])
  const pixelTriggers = ref<SelectOption[]>([])

  const CheckmarkComponent = markRaw(Checkmark)
  const CloseComponent = markRaw(Close)
  const MinusComponent = markRaw(Minus)
  const PlusComponent = markRaw(Plus)

  const isAddPage = computed<boolean>(() => id.value === 0)
  const isEditPage = computed<boolean>(() => {
    return !isAddPage.value
  })

  const dblclick = (key: string) => {
    if (isAddPage) return
    switch (key) {
      case 'pixel_id':
        isDisablePixelId.value = true
        break
      case 'pixel_token':
        isDisablePixelToken.value = true
        break
      case 'traffic_source':
        isDisableTrafficSource.value = true
        break
    }

    const divElement = document.querySelector('#pixel_id')
    const inputElement = divElement?.querySelector('input')
    inputElement?.removeAttribute('readonly')
  }

  // Hàm reset dữ liệu permission
  const clearData = () => {
    pixelConfig.value = getDefaultPixelConfig()
  }

  return {
    // State
    pixelConfig,
    trafficSource,
    id,
    isTrafficLoading,
    isDisable,
    isLoading,
    isEditPage,
    isAddPage,
    isLoadingPixels,
    eventType,
    name,
    isDisableTrafficSource,
    pixelTriggers,
    isDisablePixelId,

    // Actions
    clearData,
    dblclick,
    newPixelEvent,
    Checkmark: CheckmarkComponent,
    Close: CloseComponent,
    Minus: MinusComponent,
    Plus: PlusComponent,
  }
})
