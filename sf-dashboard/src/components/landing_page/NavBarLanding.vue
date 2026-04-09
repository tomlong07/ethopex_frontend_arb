<script setup lang="ts">
import { MenuOption, NMenu, NIcon } from 'naive-ui'
import useLandingStore from '@/store/details/landingNewStore'
import AddAd from '@/assets/icons/AddAd.vue'
import Description from '@/assets/icons/Description.vue'
import { landingTypeClass } from '@/types/components/landing'
import { DS } from '../../enum/campaign'
import MenuIcon from '@/assets/icons/MenuIcon.vue'
import { L } from '@/enum/landing'

const landingNewStore = useLandingStore()

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const options = computed(() => {
  const steps = props.landing.IsShowContentBox()
    ? landingNewStore.steps
    : landingNewStore.steps.filter((s) => s.key === L.BASIC)

  return steps.map((it, idx) => ({
    key: it.key,
    label: it.label,
    children: it.children?.map((c, cIdx) => ({
      key: `${idx}-${cIdx}`,
      label: c.label,
    })),
  }))
})

watch(
  () => props.landing.demand_source,
  (newValue, oldValue) => {
    if (newValue == DS.ADSENSE) {
      console.log(newValue)
    }
  }
)

const renderMenuIcon = (option: MenuOption) => {
  const baseKey = String(option.key).split('-')[0]
  let icon: any
  switch (baseKey) {
    case L.BASIC:
      icon = AddAd
      break
    case L.CONTENT:
      icon = Description
      break
    default:
      icon = Description
  }

  return h(NIcon, { size: 21 }, { default: () => h(icon) })
}

const value = computed({
  get: () => landingNewStore.currentStep?.key ?? '',
  set: (v: string) => {
    const idx = landingNewStore.steps.findIndex((s) => s.key === v)
    if (idx >= 0) landingNewStore.goToStep(idx)
  },
})

// reset về menu đầu tiên
onBeforeMount(() => {
  if (landingNewStore.steps && landingNewStore.steps.length > 0) {
    landingNewStore.goToStep(0)
  }
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
    class="main-nav-landing"
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
