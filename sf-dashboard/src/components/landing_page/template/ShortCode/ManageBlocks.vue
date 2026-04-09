<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import NewspaperOutline from '@/assets/icons/NewspaperOutline.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import useShortCodeBlock from '@/store/useShortCodeBlock'
import { blockCode } from '@/types/components/landing'
import { useBlockRenderer } from '@/composables/BlockRenderer'
const { BlockRenderer } = useBlockRenderer()

const store = useShortCodeBlock()

const duplicateBlock = (index: number) => {
  const originalBlock = store.draftBlocks[index]
  if (!originalBlock) return

  const duplicatedBlock: blockCode = store.deepClone(originalBlock)
  duplicatedBlock.id = store.generateId()

  store.draftBlocks.push(duplicatedBlock)
  store.hasUnsavedChanges = true
  store.showNotification(
    `Duplicated ${store.convertName(originalBlock.template)} successfully!`
  )

  const newIndex = store.draftBlocks.length - 1
  store.editBlock(newIndex)
}

const deleteBlock = (index: number) => {
  if (!store.draftBlocks) return
  store.draftBlocks.splice(index, 1)
  store.hasUnsavedChanges = true
  store.showNotification('Delete successful!')

  if (store.editingIndex === index) {
    if (store.draftBlocks.length > 0) {
      const newIndex =
        index < store.draftBlocks.length ? index : store.draftBlocks.length - 1
      nextTick(() => store.editBlock(newIndex))
    } else {
      store.resetEditState()
    }
  } else if (store.editingIndex !== undefined && store.editingIndex > index) {
    store.editingIndex--
    const updatedBlock = store.displayedBlocks[store.editingIndex]
    if (updatedBlock) {
      store.editingForm = store.deepClone(updatedBlock)
    } else {
      store.resetEditState()
    }
  }
}
</script>
<template>
  <div class="space-y-4 mb-3">
    <div
      v-if="store.displayedBlocks.length === 0"
      class="text-center py-8 text-gray-500"
    >
      <n-icon size="89" class="mb-1 opacity-30"><NewspaperOutline /></n-icon>
      <p class="opacity-45 dark-mode-text">No CodeBlock yet. Add a new one!</p>
    </div>
    <div
      v-else
      class="grid grid-cols-1 gap-4 pr-1 custom-dark-mode-shortcode-active"
    >
      <div
        v-for="(block, index) in store.displayedBlocks"
        :key="block.id"
        class="border items-center relative rounded-lg p-3 shadow-md transition-all hover:shadow-lg cursor-pointer custom-dark-mode-shortcode"
        :class="{
          'border-1 border-blue-500 bg-blue-50': store.editingIndex === index,
          'border-gray-200 hover:border-blue-300': store.editingIndex !== index,
        }"
        @click="store.editBlock(index)"
      >
        <div class="flex justify-between items-start">
          <div class="p-1">
            <n-tooltip trigger="hover" placement="top-start">
              <template #trigger>
                <div
                  class="font-semibold text-xs text-gray-900 flex items-center flex-wrap gap-1"
                >
                  <span>{{ store.convertName(block.template) }}</span>
                  <span class="font-light text-xs">[{{ block.id }}]</span>
                  <n-icon
                    size="10"
                    class="cursor-pointer flex-shrink-0"
                    @click.stop="store.handleCopyShortcode(block.id)"
                  >
                    <Copy />
                  </n-icon>
                </div>
              </template>
              Copy Block Code
            </n-tooltip>
          </div>
          <div class="flex space-x-2">
            <n-tooltip trigger="hover" placement="top-end">
              <template #trigger>
                <n-button size="small" @click.stop="duplicateBlock(index)">
                  <template #icon
                    ><n-icon size="medium"><DuplicateOutline /></n-icon
                  ></template>
                </n-button>
              </template>
              Duplicate Block
            </n-tooltip>
          </div>
        </div>
        <RemoveButton
          @onClick="() => deleteBlock(index)"
          placement="top-end"
          text="Remove Code Block"
        />
        <div class="rounded overflow-hidden w-full h-30 mt-2 relative">
          <div
            class="inset-0 transform bg-slate-50 scale-[1.0] origin-top-left"
          >
            <BlockRenderer
              v-if="block.template"
              :template="block.template"
              :block-data="store.getBlockData(block)"
              :items="block.items || {}"
              block-class="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
