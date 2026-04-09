<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { landingTypeClass } from '@/types/components/landing'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})
const isShow = computed(() => {
  return props.landing.IsShowPrelanderConfigs()
})

const name = `Sponsored Title`
</script>
<template>
  <FloatingWrapper
    :name="name"
    medium
    rounded
    v-if="isShow && props.landing.prelander_configs"
  >
    <n-input
      v-model:value="props.landing.prelander_configs.sponsored_title"
      :placeholder="name"
      maxlength="500"
    />
  </FloatingWrapper>
</template>
