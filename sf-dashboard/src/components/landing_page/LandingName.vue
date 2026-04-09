<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  return props.landing.demand_source !== 'adsense'
})

watch(
  () => isShow.value,
  (newValue, oldValue) => {
    if (newValue) {
    } else {
      props.landing.name = ''
    }
  }
)

const name = `Name`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-if="isShow">
    <div class="flex items-center gap-2">
      <n-input v-model:value="props.landing.name" :placeholder="name" />
    </div>
  </FloatingWrapper>
</template>
