<script setup lang="ts">
import { useImagePropertiesStore } from '@/store/useImageProperties'

interface Props {
  editingImageElement?: HTMLImageElement | null
  editorInstance?: any
  onClose?: () => void
  onOk?: () => void
}

const props = defineProps<Props>()

// Use store directly
const store = useImagePropertiesStore()

// Computed để lấy data từ store
const hasImageUrl = computed(() => store.hasImageUrl)
const isEditing = computed(() => !!props.editingImageElement)

const handleClose = () => {
  if (props.onClose) {
    props.onClose()
  }
}

const handleOk = () => {
  if (props.onOk) {
    props.onOk()
  }
}
</script>

<template>
  <div
    class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white z-10 flex justify-end gap-2"
  >
    <n-button @click="handleClose">Cancel</n-button>
    <n-button type="primary" @click="handleOk" :disabled="!hasImageUrl">
      {{ isEditing ? 'Update' : 'OK' }}
    </n-button>
  </div>
</template>
