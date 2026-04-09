<template>
  <div
    v-if="store.showAllBlocksFloating"
    class="floating-blocks fixed z-50 shadow-2xl cursor-move bg-white rounded-lg custom-dark-mode-floating"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @mousedown="startDrag"
    @touchstart="startTouchDrag"
  >
    <div class="relative rounded-lg">
      <!-- Header with title and close button -->
      <div
        class="flex justify-between bg-[#2d5bc8e3] items-center p-3 bg-custom"
      >
        <h3 class="text-white font-medium">Code Blocks</h3>
        <n-button
          quaternary
          circle
          size="small"
          class="text-white"
          @click="closeBlocks"
        >
          <template #icon>
            <n-icon><Close /></n-icon>
          </template>
        </n-button>
      </div>

      <!-- Blocks container with scroll -->
      <div
        class="p-2 blocks-container overflow-y-auto bg-[#e8efff7c] custom-scrollbar"
        style="max-height: 70vh"
      >
        <div
          v-if="store.shortCodeBlocks.length === 0"
          class="text-center py-8 text-gray-500"
        >
          No blocks available
        </div>
        <div v-else class="space-y-5 mb-6">
          <div
            v-for="block in store.shortCodeBlocks"
            :key="block.id"
            class="border border-gray-200 mt-3 bg-[#F9FAFB] rounded-lg shadow-lg relative"
          >
            <!-- Block preview -->
            <div class="rounded overflow-hidden w-full">
              <div class="bg-slate-50">
                <BlockRenderer
                  v-if="block.template"
                  :template="block.template"
                  :items="block.items || {}"
                  :block-data="store.getBlockData(block)"
                  block-class="w-full h-full pointer-events-none select-none"
                />
              </div>
            </div>

            <!-- Copy ID button -->
            <div
              class="bg-gray-100 border-t -mt-2 rounded-b-lg p-2 flex justify-center cursor-pointer hover:bg-gray-100 transition-colors button-copy"
              @click="copyId(block.id)"
              title="Click to copy Block ID"
            >
              <n-icon size="13"><Copy /></n-icon>
              <span class="text-xs ml-2">Copy Id Block</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue'
import Close from '@/assets/icons/Close.vue'
import useShortCodeBlock from '@/store/useShortCodeBlock'
import { useBlockRenderer } from '@/composables/BlockRenderer'
const { BlockRenderer } = useBlockRenderer()

const store = useShortCodeBlock()

const getInitialPosition = () => {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const elementWidth = Math.min(windowWidth * 1, 725)
  const elementHeight = 725

  const x = (windowWidth - elementWidth) / 2
  const y = (windowHeight - elementHeight) / 2

  return { x, y }
}

// Set initial position based on screen size
const position = ref(getInitialPosition())
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// Function to reset position when the floating panel is reopened
const resetPosition = () => {
  position.value = getInitialPosition()
}

// Listen for resetPosition event
onMounted(() => {
  document.addEventListener('resetPosition', resetPosition)
})

onUnmounted(() => {
  document.removeEventListener('resetPosition', resetPosition)
})

// Watch for changes in visibility to reset position when the panel becomes visible
watch(
  () => store.showAllBlocksFloating,
  (newValue) => {
    if (newValue === true) {
      resetPosition()
    }
  }
)

// Helper function to check if we should ignore drag on certain elements
const shouldIgnoreDrag = (target: HTMLElement): boolean => {
  return (
    target.tagName === 'BUTTON' ||
    !!target.closest('button') ||
    !!target.closest('.n-button') ||
    !!target.closest('.bg-gray-100') || // Footer with copy button
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA'
  )
}

// Mouse event handlers for desktop
const startDrag = (e: MouseEvent) => {
  // Don't drag when clicking interactive elements
  const target = e.target as HTMLElement
  if (shouldIgnoreDrag(target)) {
    return
  }

  isDragging.value = true
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }

  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

const drag = (e: MouseEvent) => {
  if (!isDragging.value) return

  position.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y,
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}

// Touch event handlers for mobile
const startTouchDrag = (e: TouchEvent) => {
  // Prevent scrolling while dragging
  e.preventDefault()

  const target = e.target as HTMLElement
  if (shouldIgnoreDrag(target)) {
    return
  }

  isDragging.value = true
  const touch = e.touches[0]
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  dragOffset.value = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  }

  document.addEventListener('touchmove', touchDrag, { passive: false })
  document.addEventListener('touchend', stopTouchDrag)
  document.addEventListener('touchcancel', stopTouchDrag)
}

const touchDrag = (e: TouchEvent) => {
  if (!isDragging.value) return

  // Prevent scrolling while dragging
  e.preventDefault()

  const touch = e.touches[0]
  position.value = {
    x: touch.clientX - dragOffset.value.x,
    y: touch.clientY - dragOffset.value.y,
  }
}

const stopTouchDrag = () => {
  isDragging.value = false
  document.removeEventListener('touchmove', touchDrag)
  document.removeEventListener('touchend', stopTouchDrag)
  document.removeEventListener('touchcancel', stopTouchDrag)
}

const closeBlocks = () => {
  store.closeAllBlocksFloating()
}

const copyId = (id?: string) => {
  if (id) {
    store.handleCopyShortcode(id)
  }
}

// Cleanup event listeners on unmount
onUnmounted(() => {
  // Clean up mouse events
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)

  // Clean up touch events
  document.removeEventListener('touchmove', touchDrag)
  document.removeEventListener('touchend', stopTouchDrag)
  document.removeEventListener('touchcancel', stopTouchDrag)
})
</script>

<style scoped>
.floating-blocks {
  user-select: none;
  width: 90%;
  max-width: 400px;
  /* Ensure it's fully visible on mobile */
  max-height: 80vh;
  /* Prevent it from going off-screen on mobile */
  overflow: hidden;
}

.blocks-container {
  min-height: 100px;
  /* Shorter max-height on mobile to ensure it fits */
  max-height: 60vh;
}

.custom-scrollbar {
  scrollbar-width: thin;
}

/* Mobile-specific adjustments */
@media (max-width: 767px) {
  .floating-blocks {
    /* Add subtle visual indicator that it can be moved on mobile */
    border-top: 4px solid #3b82f6;
  }
}
</style>
