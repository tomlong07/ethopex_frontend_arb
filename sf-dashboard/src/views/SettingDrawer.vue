<template>
  <n-drawer
    v-model:show="drawerVisible"
    :width="300"
    placement="right"
    @update:show="onDrawerVisibleChange"
  >
    <n-drawer-content title="System settings" closable>
      <n-space vertical>
        <n-divider>Layout Setting</n-divider>
        <n-space justify="space-between">
          <span>Pin Sidebar Menu</span>
          <n-switch v-model:value="isHardMenu" />
        </n-space>

        <n-space justify="space-between">
          <span>Bookmark Menu</span>
          <n-switch
            v-model:value="bookmarkMenu"
            :on-update:value="updateBookmarkMenu"
          />
        </n-space>

        <n-space justify="space-between">
          <span>Save Recent</span>
          <n-switch v-model:value="isSaveRecent" />
        </n-space>

        <!-- Chỉ đang bật vs dev để test -->
        <n-space justify="space-between" v-if="isDev">
          <span>New Layout</span>
          <n-switch v-model:value="isNewLayout" />
        </n-space>
      </n-space>
      <template #footer>
        <n-button type="error" @click="saveSetting()"> Save </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import useGeneralStore from '@/store/useGeneralStore'
import { ref, watch } from 'vue'

// !! Props
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const isDev = window.arb.isDev()

// !! State
const drawerVisible = ref<boolean>(props.visible)
const generalStore = useGeneralStore()

const listKeyFavourite = ref<string[]>([])
const isHardMenu = ref<boolean>(false)
const bookmarkMenu = ref<boolean>(false)
const isFavouriteMenu = ref<boolean>(false)
const isSaveRecent = ref<boolean>(false)
const isNewLayout = ref<boolean>(false)
// !! Lifecycle hook
watch(
  () => props.visible,
  (val) => {
    drawerVisible.value = val
  }
)
onMounted(() => {
  generalStore.loadSystemSettings()
  listKeyFavourite.value = helper.clone(generalStore.listKeyFavourite)
  isHardMenu.value = generalStore.isHardMenu
  bookmarkMenu.value = generalStore.bookmarkMenu
  isFavouriteMenu.value = generalStore.isFavouriteMenu
  isSaveRecent.value = generalStore.isSaveRecent
  isNewLayout.value = generalStore.isNewLayout
})
// !! Func
const onDrawerVisibleChange = (val: boolean) => {
  drawerVisible.value = val
  emit('update:visible', val)
}

const updateBookmarkMenu = (value: boolean) => {
  bookmarkMenu.value = value
  if (!bookmarkMenu.value) {
    isFavouriteMenu.value = false
    listKeyFavourite.value = []
  }
}

const saveSetting = () => {
  generalStore.listKeyFavourite = helper.clone(listKeyFavourite.value)
  generalStore.isHardMenu = isHardMenu.value
  generalStore.bookmarkMenu = bookmarkMenu.value
  generalStore.isFavouriteMenu = isFavouriteMenu.value
  generalStore.isSaveRecent = isSaveRecent.value
  generalStore.isNewLayout = isNewLayout.value

  generalStore.saveModeSettings(true)
}
</script>
