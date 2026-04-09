<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useGeneralStore from '@/store/useGeneralStore'
import draggable from 'vuedraggable'
import { NDropdown } from 'naive-ui'
import StarOutline from '@/assets/icons/StarOutline.vue'
import useResponsive from '@/composables/useResponsive'

// !! State
const generalStore = useGeneralStore()
const router = useRouter()
const route = useRoute()
const { isResponsive } = useResponsive()

// !! Lifecycle hook
const isFavouriteMenu = computed(
  () => window.arb?.user?.modeSettings?.favouriteMenu || false
)

const keyRouterList = computed<{ [key: string]: string }>(() => {
  return generalStore.keyRouterList
})

const panels = computed(() => generalStore.getListFavouriteForKey())

const activeKey = computed(() => {
  return (
    (window.route?.meta.activeMenu as string) ||
    keyRouterList.value[window.route.meta.url as string]
  )
})

// !! Func
const handleTabChange = (newKey: string) => {
  const targetPanel = panels.value.find((panel) => panel.key === newKey)

  if (!targetPanel) return

  if (targetPanel.href) {
    window.open(targetPanel.href, '_blank')
    return
  }

  if (targetPanel.url) {
    router.push(targetPanel.url)
    return
  }
}

const handleDragEnd = () => {
  generalStore.saveModeSettings()
}

const getLinkUrl = (key: string) => {
  const panel = panels.value.find((p) => p.key === key)
  return panel?.url || panel?.href || '#'
}
const handleLinkClick = (e: MouseEvent, key: string) => {
  if (e.ctrlKey || e.metaKey || e.button === 1) return

  e.preventDefault()
  handleTabChange(key)
}

const dropdownOptions = computed(() =>
  panels.value.map((p) => ({
    label: p.name,
    key: p.key,
  }))
)

const handleSelectDropdown = (key: string) => {
  handleTabChange(key)
}
</script>

<template>
  <div class="flex items-center px-3">
    <draggable
      v-if="(isFavouriteMenu && !isResponsive) || !isFavouriteMenu"
      v-model="generalStore.listKeyFavourite"
      :animation="200"
      item-key="key"
      tag="div"
      class="draggable-tabs"
      @end="handleDragEnd"
    >
      <template #item="{ element: key }">
        <a
          :href="getLinkUrl(key)"
          @click="handleLinkClick($event, key)"
          class="px-2 py-1 hover:underline underline-offset-4"
          :class="[
            key === activeKey
              ? 'text-black underline decoration-2'
              : 'text-gray-500',
          ]"
        >
          {{ panels.find((p: any) => p.key === key)?.name }}
        </a>
      </template>
    </draggable>

    <div v-if="isResponsive && isFavouriteMenu">
      <n-dropdown
        trigger="click"
        :options="dropdownOptions"
        @select="handleSelectDropdown"
      >
        <template #default>
          <span class="dropdown-icon">
            <StarOutline class="icon" />
          </span>
        </template>
      </n-dropdown>
    </div>
  </div>
</template>

<style scoped>
.draggable-tabs {
  display: flex;
  gap: 8px;
}

.mt-16 {
  margin-top: 16px;
}

.dropdown-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown-icon .icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.dropdown-icon:hover .icon {
  transform: scale(1.1);
  filter: brightness(1.2);
}
</style>
