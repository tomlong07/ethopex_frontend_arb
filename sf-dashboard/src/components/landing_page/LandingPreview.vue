<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const previewAd = () => {
  if (props.landing.preview == '') {
    return
  }
  window.open(props.landing.preview, '_blank')
}
</script>
<template>
  <n-button
    color="#f43f5e"
    size="medium"
    type="default"
    v-if="props.landing.preview && props.landing.demand_source !== 'pubpower'"
    @click="previewAd"
  >
    Preview
  </n-button>
</template>
