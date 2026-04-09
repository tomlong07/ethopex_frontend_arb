<script setup lang="ts">
import { IconTrafficSourcesCDN } from '@/map/campaign'
import { nextTick } from 'vue'

import useGeneralStore from '@/store/useGeneralStore'
const generalStore = useGeneralStore()

const modules = import.meta.glob('@/assets/icons/*.vue', { eager: true })

const icons = Object.entries(modules).map(([path, mod]) => {
  const name = path.split('/').pop()?.replace('.vue', '') || 'Unknown'
  return {
    name,
    component: (mod as any).default,
    containerRef: null as HTMLDivElement | null,
  }
})

function copyName(name: string) {
  navigator.clipboard.writeText(name)
  alert(`✅ Đã copy tên: ${name}`)
}

async function copySVG(icon: any) {
  await nextTick()

  const el = icon.containerRef
  const svg = el?.querySelector('svg')
  if (svg) {
    navigator.clipboard.writeText(svg.outerHTML)
    alert(`✅ Đã copy SVG của: ${icon.name}`)
  } else {
    alert('⚠️ Không tìm thấy SVG trong icon')
  }
}

const copySVGFromCDN = async (icon: any) => {
  navigator.clipboard.writeText(icon.url)
  alert(`✅ Đã copy SVG của: ${icon.url}`)
}
</script>

<template>
  <div>
    <div>
      <div class="p-4 text-lg font-semibold">Icons from CDN</div>
      <div class="grid grid-cols-4 gap-4 p-4 custom-bg-full">
        <div
          v-for="(icon, key, index) in IconTrafficSourcesCDN"
          :key="key"
          class="flex flex-col items-center text-center border p-2 rounded hover:shadow-md transition custom-bd-icon"
        >
          <!-- Gán ref bằng callback để lấy đúng DOM -->
          <div class="cursor-pointer" @click="copyName(icon.URL())">
            <img
              class="rounded p-0.5"
              :style="
                generalStore.isDark ? { backgroundColor: 'white' } : undefined
              "
              :src="icon.URL()"
              :width="icon.size"
              :height="icon.size"
              loading="lazy"
            />
          </div>
          <!-- Hiển thị số thứ tự + tên icon -->
          <span class="text-xs text-gray-600 mb-1">
            {{ index + 1 }}. {{ icon.url }}
          </span>
          <button
            class="text-xs text-blue-500 underline hover:text-blue-700"
            @click="copySVGFromCDN(icon)"
          >
            Copy SVG
          </button>
        </div>
      </div>
    </div>

    <div>
      <div class="p-4 text-lg font-semibold pb-2">Icons Assets</div>
      <div class="grid grid-cols-4 gap-4 p-4 custom-bg-full">
        <div
          v-for="(icon, index) in icons"
          :key="icon.name"
          class="flex flex-col items-center text-center border p-2 rounded hover:shadow-md transition custom-bd-icon"
        >
          <!-- Gán ref bằng callback để lấy đúng DOM -->
          <div
            class="cursor-pointer"
            :ref="(el) => (icon.containerRef = el as HTMLDivElement)"
            @click="copyName(icon.name)"
          >
            <component
              :is="icon.component"
              class="w-8 h-8 mb-2 text-gray-700"
            />
          </div>
          <!-- Hiển thị số thứ tự + tên icon -->
          <span class="text-xs text-gray-600 mb-1">
            {{ index + 1 }}. {{ icon.name }}
          </span>
          <button
            class="text-xs text-blue-500 underline hover:text-blue-700"
            @click="copySVG(icon)"
          >
            Copy SVG
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
