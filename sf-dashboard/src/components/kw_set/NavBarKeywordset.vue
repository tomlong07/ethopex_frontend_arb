<script setup lang="ts">
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import MenuIcon from '@/assets/icons/MenuIcon.vue'
import { MenuOption, NIcon } from 'naive-ui'

const props = defineProps({
  isInModal: {
    type: Boolean,
    default: false,
  },
})

const kwsetStore = useKeywordSetStore()
const collapsed = ref(false)
const windowWidth = ref(window.innerWidth)
const menuRef = ref<HTMLElement | null>(null)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value < 1024) {
    collapsed.value = true
  } else {
    collapsed.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (windowWidth.value >= 1024) return
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    collapsed.value = true
  }
}

onMounted(() => {
  kwsetStore.activeKey = 'ALL'
  window.addEventListener('resize', handleResize)
  window.addEventListener('click', handleClickOutside)
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('click', handleClickOutside)
})

const menuOptions = computed(() => {
  return [
    {
      label: 'Keyword set',
      key: 'keyword_set',
      children: kwsetStore.countryOptions.map((c) => ({
        label: c.label,
        key: c.value,
      })),
    },
  ]
})

const countryKeySet = computed(
  () => new Set(kwsetStore.countryOptions.map((c) => c.value))
)

const handleUpdateValue = async (key: string) => {
  kwsetStore.activeKey = key

  if (countryKeySet.value.has(key)) {
    kwsetStore.dataConfig.country = key
    await kwsetStore.updateTable()
  }

  if (key === 'campaigns') {
    await kwsetStore.fetchCampaignsUsed()
  }
}

const handleToggleMenu = () => {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div
    class="z-20 bg-white border h-dvh !border-gray-200/70 transition-all duration-300 fixed top-14"
    ref="menuRef"
  >
    <button class="px-6 pt-6 block lg:hidden" @click="handleToggleMenu">
      <n-icon :component="MenuIcon" size="22" />
    </button>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="280"
        :collapsed="collapsed"
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          :value="kwsetStore.activeKey"
          :options="menuOptions"
          @update:value="handleUpdateValue"
        />
        <div
          v-if="!collapsed"
          class="campaign-item text-gray-500"
          :class="{ active: kwsetStore.activeKey === 'campaigns' }"
          @click="handleUpdateValue('campaigns')"
        >
          Campaign used
        </div>
      </n-layout-sider>
    </n-layout>
  </div>
</template>

<style scoped>
.campaign-item {
  border-top: 1px solid #e5e7eb;
  padding: 12px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.campaign-item:hover {
  background: var(--n-item-color-hover, rgba(45, 92, 200, 0.06));
}

.campaign-item.active {
  color: var(--n-item-text-color-active, #2d5cc8);
  background: var(--n-item-color-active, rgba(45, 92, 200, 0.1));
}
.n-layout-sider {
  --n-border-color: none !important;
}
</style>
