<script setup lang="ts">
import { CONTENT_SAFETY } from '@/enum/creative'
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const currentMedia = computed(() => {
  const previewImage = props.status.previewItem?.image
  if (!previewImage) return null
  return props.cre.ImageShow(previewImage)
})

const typeSafe = computed(() => {
  switch (currentMedia.value?.content_safety) {
    case CONTENT_SAFETY.SAFE:
      return 'success'
    case CONTENT_SAFETY.UNSAFE:
      return 'error'
    default:
      return undefined
  }
})

const isAdm = window.arb.isAdmin()
</script>

<template>
  <n-card
    class="shadow-xl"
    v-if="
      currentMedia?.media_summary ||
      currentMedia?.content_safety ||
      currentMedia?.rule_violated
    "
  >
    <div class="flex items-center gap-2" v-if="currentMedia?.content_safety">
      <div class="w-24 font-bold text-gray-500 text-xs">Content Safety</div>
      <div class="min-w-0 flex-1">
        <n-tag class="capitalize" :type="typeSafe" round>
          {{ currentMedia?.content_safety || 'N/A' }}
        </n-tag>
      </div>
    </div>

    <FloatingWrapper name="Rule Violated" v-if="currentMedia?.rule_violated">
      <n-input v-model:value="currentMedia.rule_violated" readonly />
    </FloatingWrapper>

    <FloatingWrapper name="Summary" v-if="currentMedia?.media_summary">
      <n-input
        v-model:value="currentMedia.media_summary"
        readonly
        type="textarea"
      />
    </FloatingWrapper>

    <FloatingWrapper
      name="Visual Text"
      v-if="currentMedia?.advertising_text && isAdm"
    >
      <n-input v-model:value="currentMedia.advertising_text" readonly />
    </FloatingWrapper>

    <FloatingWrapper
      name="Audio Transcript"
      v-if="currentMedia?.audio_transcript && isAdm"
    >
      <n-input v-model:value="currentMedia.audio_transcript" readonly />
    </FloatingWrapper>
  </n-card>
</template>
