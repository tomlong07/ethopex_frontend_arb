<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import { storeToRefs } from 'pinia'
import { MenuOption, NIcon } from 'naive-ui'
import Grid4 from '@/assets/icons/Grid4.vue'
import Note from '@/assets/icons/Note.vue'
import Folder from '@/assets/icons/Folder.vue'
import MenuIcon from '@/assets/icons/MenuIcon.vue'
import Checkbox from '@/assets/icons/Checkbox.vue'
import MinusCheckBox from '@/assets/icons/MinusCheckBox.vue'
import useAdDataStore from '@/store/adDataStore'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const menuCampaignStore = useMenuCampaignStore()
const { activeKey, menuOptions, expandedKeys } = storeToRefs(menuCampaignStore)
const adDataStore = useAdDataStore()
const collapsed = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const mediaQuery = window.matchMedia('(max-width: 1279px)')
const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
  collapsed.value = e.matches
}

const selectAdsFromQuery = () => {
  const matched = menuCampaignStore.listAdsUrl
  if (!matched.length) return

  // chọn first để hiển thị data, highlight những ad còn lại
  const firstKey = matched[0]
  menuCampaignStore.selectedCreatives = [firstKey]
  menuCampaignStore.highlightedCreatives = matched.slice()
  menuCampaignStore.setActiveKey(firstKey)
  const parts = firstKey.split('-')
  const adGroupIndex = Number(parts[1])
  const type = parts[2]
  const creativeIndex = Number(parts[3])
  const source = type === 'c' ? 'creatives' : 'ad_creative'

  menuCampaignStore.handleChangeTab({
    adGroupIndex,
    creativeIndex,
    menuKey: firstKey,
    source,
  })

  // nếu URL chứa ad đó -> mở modal view ad tương ứng
  try {
    const group = props.campaign.ad_groups?.[adGroupIndex]
    const item =
      group &&
      (type === 'c'
        ? group.creatives?.[creativeIndex]
        : group.ad_creative?.[creativeIndex])
    if (item) {
      adDataStore.adInfo = item
      adDataStore.campaignId = props.campaign.id
      adDataStore.showModal = true
    }
  } catch (e) {
    console.error('open ad modal failed', e)
  }
}

onMounted(() => {
  menuCampaignStore.initDataMenu(
    props.campaign,
    props.statusData,
    props.FreezeData
  )
  mediaQuery.addEventListener('change', handleMediaChange)
  handleMediaChange(mediaQuery) // Initial check
  window.addEventListener('click', handleClickOutside)
  selectAdsFromQuery()
})

onBeforeUnmount(() => {
  mediaQuery.removeEventListener('change', handleMediaChange)
  window.removeEventListener('click', handleClickOutside)
})

watch(
  [() => props.campaign.origin_name, () => props.campaign.ad_groups],
  () => {
    // Delay để đảm bảo store đã được init đầy đủ

    nextTick(() => {
      menuCampaignStore.buildMenu()
      menuCampaignStore.handleShowActionButton()
    })
  },
  { deep: true }
)

const renderMenuIcon = (option: MenuOption) => {
  const baseKey = String(option.key).split('-')[0]
  let icon: any
  switch (baseKey) {
    case 'ad_groups':
      icon = Grid4
      break
    case 'ad_creative':
    case 'creatives':
      icon = Note
      break
    default:
      icon = Folder
  }

  return h(NIcon, { size: 18 }, { default: () => h(icon) })
}

function flattenMenu(options: MenuOption[]): MenuOption[] {
  const flat: MenuOption[] = []

  const loop = (opts: MenuOption[]) => {
    for (const opt of opts) {
      flat.push({
        key: opt.key,
        label: undefined,
        icon: opt.icon,
        children: undefined,
        ...((opt as any).props ? { props: { ...(opt as any).props } } : {}),

        ...((opt as any).onClick ? { onClick: (opt as any).onClick } : {}),
      })
      if (opt.children) {
        loop(opt.children)
      }
    }
  }

  loop(options)
  return flat
}

const sidebarMenuOptions = computed<MenuOption[]>(() => {
  if (collapsed.value) {
    return flattenMenu(menuOptions.value)
  }
  return menuOptions.value
})

const handleToggleMeunu = () => {
  collapsed.value = !collapsed.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (mediaQuery.matches === false) return

  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    collapsed.value = true
  }
}

const isShowActionButton = computed(
  () => (menuCampaignStore.selectedCreatives?.length ?? 0) > 0
)

const handleSelectAllCreative = () => {
  menuCampaignStore.handleSelectAllCreatives()
}

const handleDeleteCreative = () => {
  if (
    menuCampaignStore.selectedCreatives &&
    menuCampaignStore.selectedCreatives?.length >= 2
  ) {
    const cf = window.confirm(
      `Do you want to delete ${menuCampaignStore.selectedCreatives?.length} ads`
    )
    if (cf) menuCampaignStore.deleteCreativesFromAdGroup()
  } else {
    menuCampaignStore.deleteCreativesFromAdGroup()
  }
}

const isSelectedAllCreatives = computed(() => {
  const all = menuCampaignStore.adGroup.creatives?.length ?? 0
  const selected = menuCampaignStore.selectedCreatives?.length ?? 0
  return all > 0 && all === selected
})
</script>

<template>
  <div
    class="z-20 bg-white border h-dvh !border-gray-200/70 menu-scroll transition-all duration-300 fixed top-14 custom-border-nav"
    ref="menuRef"
  >
    <button class="px-6 pt-6 block xl:hidden" @click="handleToggleMeunu">
      <n-icon :component="MenuIcon" size="22" />
    </button>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        class="px-2"
        :class="[isShowActionButton ? 'mb-28' : 'mb-16']"
        collapse-mode="width"
        :collapsed-width="64"
        :width="340"
        :collapsed="collapsed"
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          v-model:value="activeKey"
          :options="sidebarMenuOptions"
          :expanded-keys="expandedKeys"
          :root-indent="36"
          :indent="34"
          :expand-on-click="!collapsed"
          :render-icon="collapsed ? renderMenuIcon : undefined"
        />
      </n-layout-sider>
    </n-layout>
    <div
      class="action px-4 fixed bottom-0 z-[1] bg-white py-2 border-t w-[340px]"
      v-if="isShowActionButton"
    >
      <div class="flex gap-2">
        <n-button class="px-2" type="info" @click="handleSelectAllCreative">
          <n-icon
            :component="Checkbox"
            size="20"
            v-if="isSelectedAllCreatives"
          />
          <n-icon :component="MinusCheckBox" size="20" v-else />
        </n-button>
        <n-button type="error" @click="handleDeleteCreative"> Del </n-button>
      </div>
    </div>
  </div>
</template>

<style src="@/css/NavMenuFaceBook.scss" scoped></style>
<style>
.n-menu-item-content:has(.menu-highlight)::before {
  background: var(--n-item-color-active) !important;
}
</style>
