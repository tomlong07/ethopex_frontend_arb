<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import {
  creativeTypeClass,
  CreativeStateManager,
} from '@/types/components/creative-v2'
import { ctr_creative_request } from '@/services/ctr_creative_request'
import { renderAdFormatContent } from '@/composables/useAdFormatContent'
import { SNAP_HEIGHT, SNAP_WIDTH } from '@/constants/media'
import { LIMIT_VIDEO, LIMIT_VIDEO_SNAPCHAT } from '@/constants/limits'
import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },
})

// Reactive variables
const CreativeRequest = ref<number | null>(
  props.stateManager.CreativeRequest() || null
)
const CreativeMediaRequest = ref<number | null>(
  props.stateManager.CreativeMediaRequest() || null
)

// Text for media information
const textMedia = computed(() => {
  if (props.cre.IsSnapchat()) {
    return arb?.formatString(
      Creative.value.media_snap,
      `${SNAP_WIDTH}px`,
      `${SNAP_HEIGHT}px`,
      '9/16',
      `${LIMIT_VIDEO_SNAPCHAT}MB`
    )
  }
  if (props.cre.IsDemandGenVideo()) {
    return 'Maximum 5 YouTube videos'
  }
  return arb?.formatString(Creative.value.media_general, `${LIMIT_VIDEO}MB`)
})

// Fetch Creative Media Request
async function handleCreativeRequest() {
  if (!CreativeMediaRequest.value) {
    CreativeMediaRequest.value = props.cre.creative_media || null
  }

  if (CreativeMediaRequest.value) {
    try {
      const mediaRequest = await ctr_creative_request.GetMediaByID(
        CreativeMediaRequest.value
      )
      if (mediaRequest && mediaRequest.data) {
        CreativeRequest.value = mediaRequest.data.request_id // Gán giá trị ID từ mediaRequest
      }
    } catch (error) {
      console.error('Error fetching media request:', error)
    }
  }
}

// Navigate to view request
function viewRequest() {
  if (CreativeRequest.value && CreativeMediaRequest.value) {
    window.open(
      window.router.resolve({
        path: `/creative-request/${CreativeRequest.value}`,
        query: {
          media_request: CreativeMediaRequest.value,
        },
      }).href,
      '_blank'
    )
  } else {
    console.warn('Missing CreativeRequest or CreativeMediaRequest.')
  }
}

// Fetch data when component is mounted
onMounted(() => {
  handleCreativeRequest()
})

const RenderContent = defineComponent({
  render: renderAdFormatContent,
})
</script>

<template>
  <div class="flex flex-row items-center gap-2">
    {{ props.cre.IsDemandGenVideo() ? 'Youtube Links' : 'Media' }}
    <n-popover trigger="hover" :width="320">
      <template #trigger>
        <n-icon :component="QuestionCircleRegular" size="14"></n-icon>
      </template>
      <RenderContent v-if="props.cre.IsResponsive()" />
      <div v-else>
        <span
          v-if="props.cre.IsFacebookSingleVideo()"
          class="text-xs leading-relaxed whitespace-pre-line"
          v-html="Creative.video_popover"
        >
        </span>
        <span v-else>{{ textMedia }}</span>
      </div>
    </n-popover>
    <n-button
      type="info"
      size="medium"
      @click="viewRequest"
      v-if="CreativeRequest && CreativeMediaRequest"
    >
      View Request
    </n-button>
  </div>
</template>
