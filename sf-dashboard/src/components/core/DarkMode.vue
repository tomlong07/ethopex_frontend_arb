<script setup lang="ts">
import useGeneralStore from '@/store/useGeneralStore'
import { NIcon, NDropdown, NButton, NSpin } from 'naive-ui'
import System from '@/assets/icons/System.vue'
import DarkMode from '@/assets/icons/DarkMode.vue'
import LightMode from '@/assets/icons/LightMode.vue'
import Checkmark2 from '@/assets/icons/Checkmark2.vue'
import { D } from '@/enum/dark_mode'

// connect to store theme
const generalStore = useGeneralStore()
const isLoadingTheme = ref(false)
const loadingBackgroundClass = ref('bg-black/95')

// Lấy theme hiện tại
const getCurrentActualTheme = (): D.DARK | D.LIGHT => {
  const el = document.documentElement
  return el.classList.contains(D.DARK) ? D.DARK : D.LIGHT
}

// Kiểm tra theme có thay đổi giữa tối/sáng không
const willThemeActuallyChange = (
  newMode: D.SYSTEM | D.DARK | D.LIGHT
): boolean => {
  const currentActual = getCurrentActualTheme()
  let newActual: D.DARK | D.LIGHT

  if (newMode === D.SYSTEM) {
    const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    newActual = isSysDark ? D.DARK : D.LIGHT
  } else {
    newActual = newMode
  }

  return currentActual !== newActual
}

// Thay đổi theme với loading overlay
const setTheme = async (key: D.SYSTEM | D.DARK | D.LIGHT) => {
  if (!willThemeActuallyChange(key)) {
    generalStore.setThemeMode(key)
    return
  }
  const currentActual = getCurrentActualTheme()
  let newActual: D.DARK | D.LIGHT
  if (key === D.SYSTEM) {
    const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    newActual = isSysDark ? D.DARK : D.LIGHT
  } else {
    newActual = key
  }
  // Đặt màu overlay: sáng->tối dùng overlay sáng, tối->sáng dùng overlay tối
  loadingBackgroundClass.value =
    currentActual === D.LIGHT && newActual === D.DARK
      ? 'bg-black/95'
      : 'bg-slate-200'

  isLoadingTheme.value = true
  try {
    generalStore.setThemeMode(key)
    await new Promise((resolve) => setTimeout(resolve, 500))
  } catch {
    const el = document.documentElement
    if (key === D.DARK) {
      el.classList.add(D.DARK)
    } else if (key === D.LIGHT) {
      el.classList.remove(D.DARK)
    } else {
      // system
      const isSysDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      if (isSysDark) el.classList.add(D.DARK)
      else el.classList.remove(D.DARK)
    }
  } finally {
    await helper.sleep(750)
    isLoadingTheme.value = false
  }
}

const themeIcons: Record<D.SYSTEM | D.DARK | D.LIGHT, Component> = {
  [D.SYSTEM]: System,
  [D.DARK]: DarkMode,
  [D.LIGHT]: LightMode,
}

const currentIcon = computed(() => {
  return themeIcons[generalStore.themeMode] || System
})

const renderIcon = (icon: Component) => {
  return () => h(NIcon, { size: 20 }, { default: () => h(icon) })
}

const dropdownOptions = computed(() => {
  const activeMode = generalStore.themeMode || D.SYSTEM

  const baseOptions = [
    { key: D.SYSTEM, label: 'System', icon: System },
    { key: D.DARK, label: 'Dark', icon: DarkMode },
    { key: D.LIGHT, label: 'Light', icon: LightMode },
  ]

  return baseOptions.map(({ key, label, icon }) => {
    const isActive = activeMode === key
    return {
      key,
      label,
      icon: renderIcon(icon),
      renderLabel: isActive
        ? () =>
            h('div', { class: 'flex items-center justify-between w-full' }, [
              h('span', { class: 'truncate' }, label),
              h(
                NIcon,
                {
                  size: 16,
                  style: { backgroundColor: '#ccc' },
                },
                { default: () => h(Checkmark2) }
              ),
            ])
        : undefined,
      props: isActive
        ? {
            style: {
              fontWeight: 600,
              backgroundColor: generalStore.isDark ? '#2d2f37' : '#ccc',
            },
          }
        : undefined,
    }
  })
})
</script>

<template>
  <div class="flex items-center gap-2">
    <n-spin
      v-if="isLoadingTheme"
      :show="true"
      :class="`fixed inset-0 z-9999 ${loadingBackgroundClass}`"
    >
      <template #description></template>
    </n-spin>

    <n-dropdown
      style="border: 1px solid #f9fafba4"
      class="custom-dark-mode-dropdown shadow-xl rounded-md"
      trigger="click"
      :to="false"
      :options="dropdownOptions"
      @select="(key) => setTheme(key as any)"
    >
      <template #default>
        <n-button size="small" text>
          <n-icon :component="currentIcon" size="20" />
        </n-button>
      </template>
    </n-dropdown>
  </div>
</template>
