<template>
  <div
    ref="el"
    class="fixed z-50 shadow-2xl cursor-move"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @touchstart="startTouchDrag"
  >
    <div>
      <n-button @click="handleClick" size="small" color="#2d5bc8e3"
        >Action</n-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDraggable } from '@/composables/useDraggable'
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()

const isHardMenu = computed(
  () => window.arb?.user?.modeSettings?.hardMenu || false
)

const el = ref<HTMLElement | null>(null)
const { position, startDrag, startTouchDrag } = useDraggable(el, {
  offset: { left: isHardMenu.value ? 300 : 100, bottom: 8 },
})

const dragging = ref(false)
let startX = 0
let startY = 0

const onMouseDown = (e: MouseEvent) => {
  dragging.value = false
  startX = e.clientX
  startY = e.clientY

  startDrag(e)
}

const onMouseMove = (e: MouseEvent) => {
  if (Math.abs(e.clientX - startX) > 3 || Math.abs(e.clientY - startY) > 3) {
    dragging.value = true
  }
}

const onMouseUp = () => {
  setTimeout(() => (dragging.value = false), 0)
}

const openBulkAction = () => {
  if (!reportStoreV2.canBulk) {
    window.message.warning(
      'Please select at least 2 campaigns to perform bulk action!'
    )
    return
  }
  reportStoreV2.toggleBulkAction()
}

const handleClick = () => {
  if (dragging.value) return
  openBulkAction()
}
</script>
