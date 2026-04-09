<script setup lang="ts">
import useGeneralStore from '@/store/useGeneralStore'
import SearchOutline from '@/assets/icons/SearchOutline.vue'
import { LOGIN_URL } from '@/constants/urls'
const QuickSearchItem = defineAsyncComponent(
  () => import('./QuickSearchItem.vue')
)

const generalStore = useGeneralStore()

const routerSearch = ref<any[]>([])
const showModal = ref<boolean>(false)
const recents = ref<any[]>([])
const originalRecents = ref<any[]>([])

const hoveredListIndex = ref<number | null>(0)
const hoveredItemIndex = ref<number | null>(0)

const osType = shallowRef<'mac' | 'windows' | 'other'>('other')
const modifierKey = ref('Ctrl')

const isScrolling = ref(false)

const detectOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  osType.value = userAgent.includes('mac')
    ? 'mac'
    : userAgent.includes('win')
    ? 'windows'
    : 'other'
  modifierKey.value = osType.value === 'mac' ? '⌘' : 'Ctrl'
}

const eventSearchRouter = (e: KeyboardEvent) => {
  const modifierPressed =
    osType.value === 'mac' ? e.metaKey || e.ctrlKey : e.ctrlKey

  if (
    modifierPressed &&
    (e.key === 'k' || e.code === 'Space' || e.key === ' ')
  ) {
    if (showModal.value) {
      showModal.value = false
    } else {
      openModalSearch()
    }
    e.preventDefault()
  }
}

const initShortcutListener = () => {
  if (helper.truePath() === LOGIN_URL) return

  detectOS()
  window.addEventListener('keydown', eventSearchRouter)
}

onMounted(() => {
  initShortcutListener()
})

onUnmounted(() => {
  window.removeEventListener('keydown', eventSearchRouter) // Sử dụng hàm đã đổi tên
})

const openModalSearch = async () => {
  window.addEventListener('keydown', listerKeyboard)
  showModal.value = true

  if (routerSearch.value.length !== generalStore.routerinfo.length) {
    routerSearch.value = helper.clone(generalStore.routerinfo)
  }

  await generalStore.getRecent()
  getRecencent()
}

const getCurrentList = () => {
  return recents.value && recents.value?.length > 0
    ? recents.value
    : routerSearch.value
}

const listerKeyboard = (e: KeyboardEvent) => {
  const currentList = getCurrentList()
  const totalItem = currentList.length

  if (totalItem === 0) return

  if (e.key === 'Enter') {
    try {
      const target = document.querySelector(
        '.router-link-search.enter-now-router a'
      ) as HTMLAnchorElement
      target?.click()
    } catch {}
  }

  if (e.key === 'ArrowDown') {
    isScrolling.value = true

    const currentList =
      hoveredListIndex.value === 0 ? recents.value : routerSearch.value
    const totalItem = currentList.length

    if (totalItem === 0) return

    if (hoveredItemIndex.value === null) {
      hoveredItemIndex.value = 0
    } else if (hoveredItemIndex.value < totalItem - 1) {
      hoveredItemIndex.value++
    } else {
      // đã ở cuối list hiện tại
      if (generalStore.isSaveRecent && recents.value.length > 0) {
        // có recents: cho phép luân phiên 0 ↔ 1
        if (hoveredListIndex.value === 0 && routerSearch.value.length > 0) {
          hoveredListIndex.value = 1
          hoveredItemIndex.value = 0
        } else if (hoveredListIndex.value === 1) {
          hoveredListIndex.value = 0
          hoveredItemIndex.value = 0
        }
      } else {
        // không có recents -> chỉ dùng list 1
        hoveredListIndex.value = 1
        if (routerSearch.value.length > 0) {
          hoveredItemIndex.value = 0
        }
      }
    }
  }

  if (e.key === 'ArrowUp') {
    isScrolling.value = true

    const currentList =
      hoveredListIndex.value === 0 ? recents.value : routerSearch.value
    const totalItem = currentList.length

    if (totalItem === 0) return

    if (hoveredItemIndex.value === null) {
      hoveredItemIndex.value = totalItem - 1
    } else if (hoveredItemIndex.value > 0) {
      hoveredItemIndex.value--
    } else {
      // đang ở đầu list hiện tại
      if (generalStore.isSaveRecent && recents.value.length > 0) {
        // có recents: cho phép luân phiên 0 ↔ 1
        if (hoveredListIndex.value === 0 && routerSearch.value.length > 0) {
          hoveredListIndex.value = 1
          hoveredItemIndex.value = routerSearch.value.length - 1
        } else if (hoveredListIndex.value === 1) {
          hoveredListIndex.value = 0
          hoveredItemIndex.value = recents.value.length - 1
        }
      } else {
        // không có recents -> chỉ dùng list 1
        hoveredListIndex.value = 1
        if (routerSearch.value.length > 0) {
          hoveredItemIndex.value = routerSearch.value.length - 1
        }
      }
    }
  }

  setTimeout(() => {
    isScrolling.value = false
  }, 200)
}

const offModal = () => {
  window.removeEventListener('keydown', listerKeyboard)
  showModal.value = false
}
const searchRouter = (search: string) => {
  const searchLower = search?.toLowerCase().trim()
  const originalRouters = helper.clone(generalStore.routerinfo)

  const filterItems = (items: any[] = []) =>
    items.filter((item) =>
      ['name', 'title', 'url'].some((key) =>
        item[key]?.toLowerCase().includes(searchLower)
      )
    )

  if (!searchLower) {
    routerSearch.value = originalRouters
    recents.value = originalRecents.value
    hoveredListIndex.value = recents.value?.length ? 0 : 1
  } else {
    routerSearch.value = filterItems(originalRouters)
    recents.value = filterItems(originalRecents.value)
    hoveredListIndex.value = recents.value?.length ? 0 : 1
  }

  hoveredItemIndex.value = 0
}

const getRecencent = async () => {
  if (
    !routerSearch.value ||
    (!generalStore.recentActivity && generalStore.isSaveRecent)
  ) {
    recents.value = []
    originalRecents.value = []
    return
  }
  const urlMap = new Map(routerSearch.value.map((item) => [item.url, item]))
  const mappingUrl = (
    Array.isArray(generalStore.recentActivity)
      ? generalStore.recentActivity
      : []
  )
    .map((url: string) => urlMap.get(url))
    .filter(Boolean)

  recents.value = mappingUrl
  originalRecents.value = mappingUrl

  hoveredListIndex.value = recents.value && recents.value?.length > 0 ? 0 : 1
  hoveredItemIndex.value = 0
}

watch(
  () => generalStore.isRecentChange,
  (v) => {
    if (showModal.value && v && generalStore.isSaveRecent) {
      getRecencent()
    }
  },
  { deep: true }
)

const changeMouseHover = (option: any) => {
  hoveredItemIndex.value = option.hoveredIndex || 0
  hoveredListIndex.value = option.hoveredList
}
</script>

<template>
  <n-tag
    round
    :bordered="false"
    class="border px-2 py-1 bg-white cursor-pointer font-semibold"
    @click="openModalSearch"
  >
    <div class="flex items-center gap-4">
      <div class="text-xs">Search...</div>
      <span class="quick-search-text-k">{{ modifierKey }} + K</span>
    </div>
  </n-tag>

  <n-modal
    v-model:show="showModal"
    preset="dialog"
    type="success"
    :closable="false"
    :show-icon="false"
    class="search-modal-pop"
  >
    <div class="w-full sticky top-0 z-10">
      <n-input :on-input="searchRouter">
        <template #prefix>
          <n-icon :component="SearchOutline" />
        </template>
        <template #suffix
          ><div
            class="content-center w-7 h-7 font-bold esc-button cursor-pointer grid items-start"
            @click="offModal"
          >
            ESC
          </div>
        </template>
      </n-input>
    </div>
    <div>
      <div
        v-if="recents.length === 0 && routerSearch.length === 0"
        class="flex justify-center items-center mt-32"
      >
        <n-empty description="No data !">
          <template #icon>
            <n-icon>
              <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 122.88 103.39"
              >
                <title>empty-folder</title>
                <path
                  d="M3,18.68H6.29V10.53a3,3,0,0,1,.86-2.09,3,3,0,0,1,2.11-.88h3.23V3a3,3,0,0,1,3-3H51.71a3,3,0,0,1,3,3V7.56h48.16a3,3,0,0,1,2.1.87,3,3,0,0,1,.87,2.1v8.14h3.34a3,3,0,0,1,3,3,3.8,3.8,0,0,1-.06.58l-3.19,23.44A31.52,31.52,0,1,1,63.82,87.2H14a7.55,7.55,0,0,1-2.91-.58A7.84,7.84,0,0,1,8.57,85a8.33,8.33,0,0,1-1.69-2.44,9.24,9.24,0,0,1-.81-2.92L0,22A3,3,0,0,1,2.66,18.7l.31,0ZM98.39,58.31h-.16l-4.08,4.08-2.8,2.8-6.87-6.88h0a1.6,1.6,0,0,0-2.23,0l-4.32,4.32a1.58,1.58,0,0,0,0,2.22l6.88,6.88-6.88,6.87h0a1.59,1.59,0,0,0,0,2.23l4.33,4.32a1.58,1.58,0,0,0,2.22,0l6.87-6.88,1.91,1.91,4.23,4.23.74.74a1.58,1.58,0,0,0,2.22,0L104.78,81a1.59,1.59,0,0,0,.14-2.06h-.14l-4.08-4.08-2.8-2.79L99.81,70,104,65.74l.74-.74a1.58,1.58,0,0,0,0-2.22l-4.33-4.33a1.59,1.59,0,0,0-2.06-.14Zm4.9-15.61,2.45-18.06H6.27L12,79a3.45,3.45,0,0,0,.26,1,2.66,2.66,0,0,0,.52.78,1.91,1.91,0,0,0,.56.38h0a1.71,1.71,0,0,0,.62.11h47.3a31.53,31.53,0,0,1,42-38.56ZM12.23,13.51v5.15l87.64-.93V13.51H51.71a3,3,0,0,1-3-3V6H18.43v4.59a3,3,0,0,1-3,3Z"
                />
              </svg>
            </n-icon>
          </template>
        </n-empty>
      </div>
      <div class="w-full overflow-y-scroll max-h-[calc(100vh-250px)]" v-else>
        <div
          class="border-b-2 border-blue-200 pb-2"
          v-if="recents && recents.length && generalStore.isSaveRecent"
        >
          <QuickSearchItem
            :data="recents"
            title="Recent"
            :is-active="hoveredListIndex === 0"
            :is-scrolling="isScrolling"
            :hovered-index="
              Number(hoveredListIndex === 0 ? hoveredItemIndex : -1)
            "
            @mouse-hover="changeMouseHover"
          />
        </div>
        <QuickSearchItem
          :data="routerSearch"
          :is-active="hoveredListIndex === 1"
          :is-scrolling="isScrolling"
          :hovered-index="
            Number(hoveredListIndex === 1 ? hoveredItemIndex : -1)
          "
          @mouse-hover="changeMouseHover"
        />
      </div>
    </div>
  </n-modal>
</template>
