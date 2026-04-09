<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { CRE_TYPE } from '@/enum/creative'
import { ctr_creative } from '@/services/ctr_creative'
import { creativeTypeClass } from '@/types/components/creative-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
})

const defaultOptions: SelectOption[] = [
  { value: 'LEARN_MORE', label: 'Learn more' },
  { value: 'LISTEN_NOW', label: 'Listen now' },
  { value: 'ORDER_NOW', label: 'Order now' },
  { value: 'PLAY_GAME', label: 'Play game' },
  { value: 'REQUEST_TIME', label: 'Request time' },
  { value: 'SHOP_NOW', label: 'Shop now' },
  { value: 'SIGN_UP', label: 'Sign up' },
  { value: 'SUBSCRIBE', label: 'Subscribe' },
  { value: 'WATCH_MORE', label: 'Watch more' },
  { value: 'APPLY_NOW', label: 'Apply now' },
  { value: 'BOOK_NOW', label: 'Book now' },
  { value: 'BUY_TICKETS', label: 'Buy tickets' },
  { value: 'CONTACT_US', label: 'Contact us' },
  { value: 'DOWNLOAD', label: 'Download' },
  { value: 'GET_OFFER', label: 'Get offer' },
  { value: 'GET_QUOTE', label: 'Get quote' },
  { value: 'GET_SHOWTIMES', label: 'Get showtimes' },
]

const tiktokOptions = ref<SelectOption[]>([])
const newsbreakOption = ref<SelectOption[]>([])

const isLoading = ref(false)

// Computed options dựa trên platform
const ctaOptions = computed(() => {
  const type = props.cre.type
  switch (type) {
    case CRE_TYPE.TIKTOK:
      return tiktokOptions.value
    case CRE_TYPE.NEWSBREAK:
      return newsbreakOption.value
    default:
      return defaultOptions
  }
})

// Computed value để control việc auto-select
const selectedValue = computed({
  get: () => {
    const currentOptions = ctaOptions.value
    const hasValidValue = currentOptions.some(
      (opt) => opt.value === props.cre.call_to_action
    )
    return hasValidValue ? props.cre.call_to_action : null
  },
  set: (value) => {
    props.cre.call_to_action = value
  },
})

const loadTikTokOptions = async () => {
  if (tiktokOptions.value.length > 0) return

  isLoading.value = true
  try {
    const rs = await ctr_creative.CallToAction({
      traffic_source: CRE_TYPE.TIKTOK,
    })
    tiktokOptions.value = rs.data.map((item: any) => ({
      label: item.name,
      value: item.value,
    }))
  } catch (error) {
    console.error('Error loading TikTok options:', error)
  } finally {
    isLoading.value = false
  }
}

const loadNewsbreakOptions = async () => {
  if (newsbreakOption.value.length > 0) return

  isLoading.value = true
  try {
    const rs = await ctr_creative.CallToAction({
      traffic_source: CRE_TYPE.NEWSBREAK,
    })
    newsbreakOption.value = rs.data.map((item: any) => ({
      label: item.name,
      value: item.value,
    }))
  } catch (error) {
    console.error('Error loading Newsbreak options:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.cre.type,
  (newValue) => {
    switch (newValue) {
      case CRE_TYPE.TIKTOK:
        loadTikTokOptions()
        break
      case CRE_TYPE.NEWSBREAK:
        loadNewsbreakOptions()
        break
      default:
        break
    }
  },
  { immediate: true }
)

const name = 'Call to Action'
</script>

<template>
  <div class="flex items-center">
    <FloatingWrapper :name="name" small rounded>
      <n-select
        v-model:value="selectedValue"
        :placeholder="name"
        :options="ctaOptions"
        :loading="isLoading"
        clearable
      />
    </FloatingWrapper>
  </div>
</template>
