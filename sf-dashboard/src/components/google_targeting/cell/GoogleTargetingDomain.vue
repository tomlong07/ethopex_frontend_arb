<script setup lang="ts">
import AppStore from '@/assets/icons/AppStore.vue'
import GooglePlay from '@/assets/icons/GooglePlay.vue'
import Youtube from '@/assets/icons/Youtube.vue'
import { ICellRendererParams } from 'ag-grid-community'

const LINK_GOOGLE_PLAY = 'https://play.google.com/store/apps/details?id='
const LINK_APP_STORE = 'https://apps.apple.com/us/app/appId/id'
const LINK_YOUTUBE_CHANNEL = 'https://www.youtube.com/channel/'
const LINK_YOUTUBE_VIDEO = 'https://www.youtube.com/watch?v='
const LINK_DEFAULT = 'https://'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const showValue = computed<string>(() => {
  if (Array.isArray(props.params.value)) {
    if (props.params.value.length === 0) {
      return ''
    }
  }
  return props.params.value
})
const hasProtocol = (url: string): boolean =>
  url.includes('http://') || url.includes(LINK_DEFAULT)

const buildUrl = (
  value: string,
  placementType: string,
  platform?: string
): string => {
  if (hasProtocol(value)) return value

  const urlBuilders = {
    MOBILE_APPLICATION: (val: string, platform?: string) => {
      if (platform?.toLowerCase() === 'ios') {
        return LINK_APP_STORE + val
      } else if (platform?.toLowerCase() === 'android') {
        return LINK_GOOGLE_PLAY + val
      }
      return LINK_GOOGLE_PLAY + val
    },
    YOUTUBE_CHANNEL: (val: string) => LINK_YOUTUBE_CHANNEL + val,
    YOUTUBE_VIDEO: (val: string) => LINK_YOUTUBE_VIDEO + val,
    default: (val: string) => LINK_DEFAULT + val,
  }
  const builder =
    urlBuilders[placementType as keyof typeof urlBuilders] ||
    urlBuilders.default
  if (placementType === 'MOBILE_APPLICATION') {
    return (builder as any)(value, platform)
  }
  return (builder as any)(value)
}

const hrefValue = computed<string>(() => {
  if (!showValue.value) return ''
  const placementType = props.params.data?.placement_type
  const platform = props.params.data?.platform
  return buildUrl(showValue.value, placementType, platform)
})

const tooltipText = computed<string>(() => {
  const placementType = props.params.data?.placement_type
  const platform = props.params.data?.platform

  const prefixes = {
    MOBILE_APPLICATION: () => {
      if (platform?.trim() === 'ios') {
        return 'iOS App: '
      } else if (platform?.trim() === 'android') {
        return 'Android App: '
      }
      return 'Mobile App: '
    },
    YOUTUBE_CHANNEL: () => 'YouTube Channel: ',
  }

  const prefixBuilder = prefixes[placementType as keyof typeof prefixes]
  const prefix = prefixBuilder ? prefixBuilder() : ''

  return `${prefix}${showValue.value}`
})

const iconType = computed<string>(() => {
  const placementType = props.params.data?.placement_type
  const platform = props.params.data?.platform

  if (placementType === 'MOBILE_APPLICATION') {
    if (platform?.toLowerCase() === 'ios') {
      return 'appstore'
    } else if (platform?.toLowerCase() === 'android') {
      return 'googleplay'
    }
    return 'googleplay'
  } else if (
    placementType === 'YOUTUBE_CHANNEL' ||
    placementType === 'YOUTUBE_VIDEO'
  ) {
    return 'youtube'
  }

  return 'website'
})
</script>
<template>
  <n-tooltip trigger="hover" placement="top-start">
    <template #trigger>
      <div class="flex items-center gap-2">
        <a
          class="text-blue-500 no-underline hover:underline"
          target="_blank"
          :href="hrefValue"
        >
          {{ showValue }}
        </a>
        <AppStore v-if="iconType === 'appstore'" class="w-5 h-5" />
        <GooglePlay v-if="iconType === 'googleplay'" class="w-5 h-5" />
        <Youtube v-if="iconType === 'youtube'" class="w-5 h-5" />
      </div>
    </template>
    {{ tooltipText }}
  </n-tooltip>
</template>
