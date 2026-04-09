<script setup lang="ts">
import {
  StatusCreativeManager,
  creativeTypeClass,
  CreativeStateManager,
} from '@/types/components/creative-v2'

const props = defineProps({
  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },

  text: {
    type: String,
    default: 'Submit',
  },
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  closeButton: {
    type: String,
    default: '',
  },

  currentTab: {
    type: String,
    default: 'content',
  },
  stateManager: {
    type: Object as () => CreativeStateManager,
  },
})
const isSubmitDisabled = computed(() => {
  // Kiểm tra nếu bất kỳ ảnh nào có url_error = true
  return props.cre.images.some((image) => image.url_error)
})

// Computed properties for tab navigation
const isContentTab = computed(() => props.currentTab === 'content')
const isMediaTab = computed(() => props.currentTab === 'media')

const submitForm = () => {
  emit('submitForm')
}

const closeForm = () => {
  emit('closeForm')
}

const goToMediaTab = () => {
  emit('switchTab', 'media')
}

const goToContentTab = () => {
  emit('switchTab', 'content')
}

const emit = defineEmits<{
  (e: 'submitForm'): void
  (e: 'closeForm'): void
  (e: 'switchTab', tab: string): void
}>()
</script>

<template>
  <div class="sticky bottom-0 p-2 z-20">
    <div class="flex justify-end gap-2">
      <n-button
        v-if="isContentTab && props.stateManager?.isModalAd !== true"
        size="medium"
        type="success"
        @click="goToMediaTab"
      >
        Next
      </n-button>
      <n-button
        v-if="isMediaTab"
        size="medium"
        @click="goToContentTab"
        class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Back
      </n-button>

      <n-button
        size="medium"
        v-if="closeButton"
        @click="closeForm"
        class="!bg-white"
      >
        {{ closeButton }}
      </n-button>

      <n-button
        color="#f43f5e"
        size="medium"
        type="success"
        :loading="props.status.isSubmitting"
        @click="submitForm"
        :disabled="isSubmitDisabled"
      >
        {{ props.text }}
      </n-button>
    </div>
  </div>
</template>
