<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import HeaderTestBudget from '@/components/core/HeaderTestBudget.vue'
import LogoComp from '@/components/core/LogoComp.vue'
import QuickSearch from '@/components/core/QuickSearch.vue'
import UserAction from '@/components/core/UserAction.vue'
import useGeneralStore from '@/store/useGeneralStore'
import useHeaderStore from '@/store/useHeaderStore'
import { useNotification } from 'naive-ui'
import useResponsive from '@/composables/useResponsive'
import Notification from '@/components/core/Notification.vue'
import MenuIcon from '@/assets/icons/MenuIcon.vue'
import DarkMode from '@/components/core/DarkMode.vue'
import { TIME_UPDATE_VERSION, TIME_UPDATE_VERSION_DEV } from '@/constants/app'
import { LOGIN_URL } from '@/constants/urls'

const FavouriteTabNavigator = defineAsyncComponent(
  () => import('./FavouriteTabNavigator.vue')
)

const generalStore = useGeneralStore()
const isMobile = helper.mobileDetect()
const { isResponsive } = useResponsive()

const headerStore = useHeaderStore()
const notification = useNotification()
const isHardMenu = computed(
  () => window.arb?.user?.modeSettings?.hardMenu || false
)
// const isFavouriteMenu = computed(
//   () =>
//     (window.arb?.user?.modeSettings?.bookmark &&
//       window.arb?.user?.modeSettings?.favouriteMenu) ||
//     false
// )
const toggleMenu = () => {
  if (isHardMenu.value) {
    generalStore.isMenuCollapse = !generalStore.isMenuCollapse
    return
  }
  generalStore.hoverMenu = !generalStore.hoverMenu
}
onMounted(async () => {
  if (helper.truePath() == LOGIN_URL) return
  headerStore.fetchVersion(notification, true)

  //set interval for loop check version
  setInterval(
    () => {
      headerStore.fetchVersion(notification)
    },
    helper.isLocal() ? TIME_UPDATE_VERSION_DEV : TIME_UPDATE_VERSION
  )
})

const offMenu = (e: any) => {
  try {
    if (!e.target.closest('.button-toggle-menu') && isMobile) {
      generalStore.hoverMenu = false
      generalStore.isMenuCollapse = false
    }
  } catch (error) {
    console.error(error)
  }
}

const isComp = window.arb.isCompany()
</script>

<template>
  <div
    class="h-[60px] flex items-center pl-2 pr-4 fixed top-0 left-0 right-0 bg-gray-100 border z-50 custom-header-border-dark-mode"
    @click="offMenu"
  >
    <div class="flex gap-2 items-center">
      <div class="flex items-center">
        <div
          class="rounded-full transition hover:bg-gray-200 active:scale-95 p-2 pb-1 button-toggle-menu"
          @click="toggleMenu"
        >
          <n-button text>
            <n-icon :component="MenuIcon" size="24" />
          </n-button>
        </div>
        <LogoComp />
      </div>
      <div class="divider-header ml-auto"></div>
    </div>

    <div class="flex items-center">
      <div
        :class="['min-w-0 truncate font-medium text-lg p-4']"
        :title="generalStore.title"
      >
        {{ generalStore.title }}
      </div>
      <div
        class="divider-header ml-auto"
        v-if="generalStore.bookmarkMenu"
      ></div>
    </div>

    <div :class="[isResponsive ? 'flex justify-end flex-1' : 'flex']">
      <FavouriteTabNavigator />
    </div>

    <div class="flex items-center gap-4 ml-auto">
      <HeaderTestBudget v-if="isComp" />
      <QuickSearch />
      <DarkMode />
      <Notification />
      <UserAction />
    </div>
  </div>
</template>

<style lang="scss">
@use '@/css/Header.scss';
</style>
