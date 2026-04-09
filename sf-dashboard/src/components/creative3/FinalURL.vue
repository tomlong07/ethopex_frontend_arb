<script setup lang="ts">
import { creativeTypeClass } from '@/types/components/creative-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
})
const name = 'Final URL'

watch(
  () => props.cre.ad_type,
  (newVal, oldVal) => {
    if (!props.cre.IsResponsive()) return
    if (newVal !== oldVal) {
      props.cre.display_link = null
    }
  },
  { immediate: false }
)
</script>

<template>
  <FloatingWrapper :name="name" small rounded v-if="props.cre.IsResponsive()">
    <n-input v-model:value="props.cre.display_link" :placeholder="name" />
  </FloatingWrapper>
</template>
