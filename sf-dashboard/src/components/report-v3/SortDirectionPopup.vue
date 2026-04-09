<!-- SortDirectionPopup.vue -->
<script setup lang="ts">
import SortAsc from '@/assets/icons/SortAsc.vue'
import SortDesc from '@/assets/icons/SortDesc.vue'
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{
  field: string
  currentDir?: string
  position: { x: number; y: number }
}>()

const visible = defineModel<boolean>('visible', { default: false })

const emit = defineEmits<{
  select: [dir: 'asc' | 'desc']
}>()

const currentPosition = ref({ x: 0, y: 0 })
const popupStyle = computed(() => ({
  left: `${currentPosition.value.x}px`,
  top: `${currentPosition.value.y}px`,
}))

const handleSelect = (dir: 'asc' | 'desc') => {
  emit('select', dir)
  visible.value = false
}

const updatePosition = () => {
  const headerElement = document.querySelector(
    `.tabulator-col[tabulator-field="${props.field}"]`
  )
  if (headerElement) {
    const rect = headerElement.getBoundingClientRect()
    currentPosition.value = { x: rect.left, y: rect.bottom + 5 }
  }
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  
  if (target.closest('.sort-popup')) {
    return
  }
  
  visible.value = false
}

const handleScroll = () => updatePosition()
watch(visible, async (isVisible) => {
  if (isVisible) {
    currentPosition.value = { ...props.position }

    await nextTick()

    document.addEventListener('mousedown', handleClickOutside)

    document
      .querySelector('.tabulator-tableholder')
      ?.addEventListener('scroll', handleScroll, { passive: true })

    window.addEventListener('scroll', handleScroll, { passive: true })
  } else {
    cleanup()
  }
})


const cleanup = () => {
  document.removeEventListener('click', handleClickOutside)
  document.querySelector('.tabulator-tableholder')?.removeEventListener('scroll', handleScroll)
  window.removeEventListener('scroll', handleScroll)
}

onBeforeUnmount(cleanup)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="sort-popup fixed bg-white rounded-lg shadow-xl border border-gray-200 min-w-[180px]"
      :style="popupStyle"
      @click.stop
    >
      <div class="py-1">
        <div
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          :class="{ 'bg-blue-50': props.currentDir === 'asc' }"
          @click="handleSelect('asc')"
        >
          <SortAsc />
          <span>Sort Ascending</span>
        </div>
        <div
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          :class="{ 'bg-blue-50': props.currentDir === 'desc' }"
          @click="handleSelect('desc')"
        >
          <SortDesc />
          <span>Sort Descending</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>