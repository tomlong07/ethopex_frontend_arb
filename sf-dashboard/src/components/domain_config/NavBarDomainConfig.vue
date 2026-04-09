<script setup lang="ts">
import { MenuOption, NMenu, NIcon } from 'naive-ui'
import useDomainConfigNavStore from '@/store/details/useDomainConfigNavStore'
import AddAd from '@/assets/icons/AddAd.vue'
import Description from '@/assets/icons/Description.vue'
import MenuIcon from '@/assets/icons/MenuIcon.vue'
import Logging from '@/assets/icons/Logging.vue'
import { DC } from '@/enum/domain_config'

const domainConfigNavStore = useDomainConfigNavStore()

const options = computed(() => {
  return domainConfigNavStore.visibleSteps.map((it) => ({
    key: it.key,
    label: it.label,
  }))
})

const renderMenuIcon = (option: MenuOption) => {
  let icon: any
  switch (option.key) {
    case DC.DOMAIN_CONFIG:
      icon = AddAd
      break
    case DC.CAMPAIGNS_USED:
      icon = Description
      break
    case DC.LOGS:
      icon = Logging
      break
    default:
      icon = Description
  }

  return h(NIcon, { size: 21 }, { default: () => h(icon) })
}

const value = computed({
  get: () => domainConfigNavStore.currentStep?.key ?? '',
  set: (v: string) => {
    const idx = domainConfigNavStore.visibleSteps.findIndex((s) => s.key === v)
    if (idx >= 0) domainConfigNavStore.goToStep(idx)
  },
})

const isNarrow = ref(
  typeof window !== 'undefined' ? window.innerWidth < 1024 : false
)
let onResize: any = null

onMounted(() => {
  onResize = () => {
    isNarrow.value = window.innerWidth < 1024
  }
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  if (onResize) window.removeEventListener('resize', onResize)
})

const isOpen = ref(false)
</script>

<template>
  <div
    :class="[
      'z-20 bg-white border h-dvh !border-gray-200/70 transition-all duration-300 fixed top-14',
      isNarrow && !isOpen ? 'w-[74px]' : 'w-[280px]',
    ]"
  >
    <button class="px-4 pt-6 block lg:hidden" @click="isOpen = !isOpen">
      <n-icon :component="MenuIcon" size="22" />
    </button>
    <n-menu
      v-model:value="value"
      :options="options"
      mode="vertical"
      :collapsed-width="64"
      :collapsed="isNarrow && !isOpen"
      :render-icon="renderMenuIcon"
    />
  </div>
</template>
