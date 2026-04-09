<script setup lang="ts">
import { ref, watch } from 'vue'
import { CampaignContext } from '@/types/components/campaign-v2'
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import { storeToRefs } from 'pinia'
import { MenuOption, NIcon } from 'naive-ui'
import Grid4 from '@/assets/icons/Grid4.vue'
import Note from '@/assets/icons/Note.vue'
import Folder from '@/assets/icons/Folder.vue'
import MenuIcon from '@/assets/icons/MenuIcon.vue'
import Checkbox from '@/assets/icons/Checkbox.vue'
import MinusCheckBox from '@/assets/icons/MinusCheckBox.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})
console.log(props.data.campaign)

const menuCampaignStore = useMenuCampaignStore()
const { activeKey, menuOptions, expandedKeys } = storeToRefs(menuCampaignStore)
const collapsed = ref(false)
const windowWidth = ref(window.innerWidth)
const menuRef = ref<HTMLElement | null>(null)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value < 1024) {
    collapsed.value = true
  }
}

onMounted(() => {
  menuCampaignStore.initDataMenu(
    props.data.campaign,
    props.data.statusData,
    props.data.FreezeData
  )
  window.addEventListener('resize', handleResize)
  window.addEventListener('click', handleClickOutside)
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('click', handleClickOutside)
})

watch(
  [() => props.data.campaign.origin_name, () => props.data.campaign.ad_groups],
  () => {
    // Delay để đảm bảo store đã được init đầy đủ

    nextTick(() => {
      menuCampaignStore.buildMenu()
      menuCampaignStore.handleShowActionButton()
    })
  },
  { deep: true }
)

watch(windowWidth, (newWidth) => {
  if (newWidth < 1024) {
    collapsed.value = true
  } else {
    collapsed.value = false
  }
})

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
  if (windowWidth.value >= 1024) return

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
    class="z-10 bg-white border h-dvh !border-gray-200/70 menu-scroll transition-all duration-300 fixed top-14 custom-border-nav"
    ref="menuRef"
  >
    <button class="px-6 pt-6 block lg:hidden" @click="handleToggleMeunu">
      <n-icon :component="MenuIcon" size="22" />
    </button>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        class="px-2"
        :class="[isShowActionButton ? 'mb-28' : 'mb-16']"
        collapse-mode="width"
        :collapsed-width="74"
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
