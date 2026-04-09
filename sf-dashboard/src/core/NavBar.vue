<script setup lang="ts">
import MenuComp from '@/components/core/MenuComp.vue'
import useGeneralStore from '@/store/useGeneralStore'
const generalStore = useGeneralStore()
const isMobile = helper.mobileDetect()

const isHardMenu = computed(
  () => window.arb?.user?.modeSettings?.hardMenu || false
)
const isShowMenu = computed(() => {
  return window.arb.user.menuLeft()
})
// THAY ĐỔI: Computed để xử lý class width
const menuWidthClass = computed(() => {
  if (isMobile && isHardMenu.value) {
    return generalStore.isMenuCollapse ? 'w-[240px]' : 'w-[52px]'
  }
  if (isHardMenu.value) {
    return !generalStore.isMenuCollapse ? 'w-[240px]' : 'w-[52px]'
  }
  return generalStore.hoverMenu ? 'w-[240px]' : 'w-[52px]'
})
</script>

<template>
  <aside
    class="fixed top-[60px] left-0 z-30 h-[calc(100vh-60px)] bg-gray-50 border-r transition-all duration-300 ease-in-out custom-bg-sidebar-dark-mode"
    :class="menuWidthClass"
    :style="{ pointerEvents: isHardMenu ? 'auto' : 'all' }"
    @mouseenter="!isHardMenu ? (generalStore.hoverMenu = true) : null"
    @mouseleave="!isHardMenu ? (generalStore.hoverMenu = false) : null"
  >
    <div class="h-full flex flex-col">
      <!-- Menu scroll area -->
      <div
        class="flex-1 scroll-thin-custom pt-2 custom-sidebar-scroll"
        :class="{ 'overflow-auto': generalStore.hoverMenu || isHardMenu }"
      >
        <MenuComp v-if="isShowMenu" />
      </div>

      <div
        class="border-t p-1 pl-4 text-xs text-gray-600 h-8 custom-ft-navbar"
        v-if="generalStore.hoverMenu || isHardMenu"
      >
        <span class="flex gap-2 w-26" :title="generalStore.userEmailShow">
          <div
            class="max-w-100px whitespace-nowrap overflow-hidden text-ellipsis font-bold"
          >
            {{ generalStore.userEmailShow }}
          </div>
        </span>
      </div>
    </div>
  </aside>
</template>
