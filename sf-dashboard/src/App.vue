<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { useRoute } from 'vue-router'

import InitWindow from '@/core/InitWindow.vue'
import TopHead from '@/core/TopHead.vue'
import NavBar from '@/core/NavBar.vue'

import { ARBUser } from '@/core/window'
import { themeOverrides } from '@/theme'

import { ctr_user } from '@/services/ctr_user'
import useGeneralStore from '@/store/useGeneralStore'
import NotifyPermission from './components/notify_system_page/NotifyPermission.vue'
import { API_DOCUMENT, LOGIN_URL, QUICK_ALT_URL } from './constants/urls'
import { DEFAULT_DURATION_MESSAGE } from './constants/app'
import { useDataTableStore } from '@/store/activity/dataTable'

const dataTableStore = useDataTableStore()

const DraftConfirmV2 = defineAsyncComponent(
  () => import('@/components/common/DraftConfirmV2.vue')
)
const Login = defineAsyncComponent(() => import('@/views/general/Login.vue'))

helper.log(import.meta.env.BUILDTIME)

//Riêng App ko dùng đc window.route vì lúc đó InitWindow chưa khởi tạo nên chưa dùng được
const route = useRoute()

const isMobile = helper.mobileDetect()
const isReady = ref(false)

const generalStore = useGeneralStore()
window.arb.user = new ARBUser(generalStore.menuNew)
window.arb.user.changeModeSettings(generalStore.modeSettings)
generalStore.loadSystemSettings()

const layout = computed(() => {
  return route.meta.layout
})

const isHardMenu = computed(
  () => window.arb?.user?.modeSettings?.hardMenu || false
)

const containerPaddingClass = computed(() => {
  if (isShowHeader.value && !isMobile) {
    return isHardMenu.value && !generalStore.isMenuCollapse
      ? 'pl-[240px]'
      : 'pl-[52px]'
  }
  return ''
})
const hiddenClass = computed(() => {
  if (isMobile) {
    return isHardMenu.value
      ? !generalStore.isMenuCollapse
      : !generalStore.hoverMenu
  }
  return false
})
const showModalLogin = computed(() => {
  return generalStore.showModalLogin
})

const isShowHeader = computed(() => {
  return (
    ![QUICK_ALT_URL, LOGIN_URL, API_DOCUMENT].includes(helper.truePath()) &&
    layout.value !== 'notfound'
  )
})

const isKeepAlive = computed(() => {
  const componentNow = route.meta?.component as string

  return (
    route.meta.keepAlive ||
    (componentNow && componentNow.includes('TemplateVue') ? true : false)
  )
})

//Handle class không cuộn khi show modal login
watch(
  () => generalStore.showModalLogin,
  (value) => {
    if (value) {
      document.body.classList.add('overflow-hidden')
      return
    }
    document.body.classList.remove('overflow-hidden')
  }
)

onMounted(async () => {
  if (isShowHeader.value) {
    isReady.value = false

    try {
      const resultMess = await ctr_user.MessageLang()

      if (resultMess?.status) {
        if (arb) {
          arb.addMess(resultMess?.data)
        }
      }
    } finally {
      isReady.value = true
    }
  }
})

const isStyle = computed(() => {
  return dataTableStore.isStyle // áp dụng trường hợp style (main) khi ở darkmode
})
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-notification-provider placement="bottom">
      <n-message-provider placement="top" :duration="DEFAULT_DURATION_MESSAGE">
        <InitWindow />
        <DraftConfirmV2 />
        <div class="h-screen flex flex-col custom-bg-full-main">
          <TopHead v-if="isShowHeader && isReady" />
          <div :class="{ 'pt-[60px]': isShowHeader }">
            <NavBar
              v-if="isShowHeader && isReady"
              :class="{ hidden: hiddenClass }"
            />

            <main
              class="flex-1 transition-all duration-300 ease-in-out h-full bg-main"
              :style="
                !isStyle
                  ? { height: isShowHeader ? 'calc(100vh - 60px)' : '100vh' }
                  : {}
              "
              :class="[containerPaddingClass]"
              @mouseenter="generalStore.hoverMenu = false"
            >
              <n-dialog-provider>
                <n-spin
                  size="large"
                  class="absolute place-self-center top-1/2 right-1/2 z-10"
                  v-if="generalStore.showLoading"
                />
                <NotifyPermission />

                <RouterView
                  v-slot="{ Component }"
                  :class="{
                    'opacity-50 pointer-events-none': generalStore.showLoading,
                    'flex-1': true,
                  }"
                >
                  <keep-alive v-if="isKeepAlive" :max="5">
                    <component :is="Component" :key="route.path"></component>
                  </keep-alive>
                  <component
                    :is="Component"
                    :key="route.path"
                    v-else
                  ></component>
                </RouterView>
              </n-dialog-provider>
              <div class="e-dlg-overlay" v-if="showModalLogin"></div>
              <Login :isModal="true" v-if="showModalLogin" />
            </main>
          </div>
        </div>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style lang="scss">
@use '@/css/App.scss';
</style>

<style lang="scss">
@use '@/css/Custom.scss';
</style>
