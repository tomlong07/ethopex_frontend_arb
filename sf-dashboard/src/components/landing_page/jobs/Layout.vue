<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useLandingStore from '@/store/useLandingStore'
import { landingTypeClass } from '@/types/components/landing'
const landingStore = useLandingStore()

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})
const isShow = computed(() => {
  return props.landing.IsShowPrelanderConfigs()
})

onMounted(async () => {
  if (isShow.value) {
    await landingStore.getLayouts()
  }
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      await landingStore.getLayouts()
    }
  }
)

const name = `Layout`
</script>
<template>
  <FloatingWrapper
    :name="name"
    medium
    rounded
    v-if="isShow && props.landing.prelander_configs"
  >
    <n-select
      v-model:value="props.landing.prelander_configs.layout"
      :placeholder="name"
      clearable
      :options="landingStore.layouts || []"
    />
  </FloatingWrapper>
</template>
