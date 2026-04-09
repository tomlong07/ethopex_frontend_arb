<script setup lang="ts">
import { useBlockRenderer } from '@/composables/BlockRenderer'
const { BlockRenderer } = useBlockRenderer()

const props = defineProps({
  template: String,
  items: Object,
  blockData: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div
    class="rounded overflow-hidden w-full h-[480px] relative bg-white overflow-y-auto custom-scrollbar custom-dark-mode-preview-shortcode"
  >
    <div class="space-y-4">
      <div class="space-y-4">
        <div class="w-56 h-6 bg-gray-200 rounded"></div>
        <div class="w-86 h-6 bg-gray-200 rounded"></div>
        <div class="w-86 h-6 bg-gray-200 rounded"></div>
        <div class="grid grid-cols-1 gap-4">
          <div class="my-4">
            <BlockRenderer
              v-if="template"
              :template="template"
              :items="items"
              :block-data="props.blockData"
            />
          </div>
        </div>
      </div>
      <div class="w-86 h-6 bg-gray-200 rounded"></div>
      <div class="flex justify-between items-center text-sm text-gray-500">
        <div class="w-56 h-6 bg-gray-200 rounded"></div>
        <div class="flex space-x-4">
          <div class="w-16 h-6 bg-gray-200 rounded"></div>
          <div class="w-16 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.custom-scrollbar {
  scrollbar-width: thin !important;
}
</style>
