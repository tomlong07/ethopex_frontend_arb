<script setup lang="ts">
import { googleAudienceData } from '@/types/components/google-audience'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  audienceConfig: {
    type: Object as () => googleAudienceData,
    required: true,
  },
})

const name = 'Audience name'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="props.audienceConfig.name"
      placeholder="Audience Name"
    />
  </FloatingWrapper>
</template>
