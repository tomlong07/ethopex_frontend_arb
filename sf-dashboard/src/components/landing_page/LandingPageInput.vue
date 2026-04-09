<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})
const isShowNormalLandingPage = computed<boolean>(() => {
  if (props.landing.demand_source !== 'adsense') {
    if (
      ['pubpower', 'arbcore'].includes(props.landing.demand_source as string) &&
      props.landing.direct_link === 'off'
    ) {
      return false
    }

    return true
  }

  return false
})

watch(
  () => isShowNormalLandingPage.value,
  (newValue, oldValue) => {
    if (newValue) {
    } else {
      props.landing.landing_page = ''
    }
  }
)

const name = computed(() => {
  if (props.landing.demand_source === 'arbcore') {
    return 'Destination URL'
  }
  return 'Landing Page'
})
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-if="isShowNormalLandingPage">
    <div class="flex items-center gap-2">
      <n-input v-model:value="props.landing.landing_page" :placeholder="name" />
    </div>
  </FloatingWrapper>
</template>
