<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { prelanderConfigs, prelanderJobs } from '@/types/components/landing'

const props = defineProps({
  job: {
    type: Object as () => prelanderJobs,
    required: true,
  },

  configs: {
    type: Object as () => prelanderConfigs,
    required: true,
  },
})

const name = `Button Text`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded>
    <n-input
      v-model:value="props.job.buttonText"
      :placeholder="name"
      maxlength="500"
    />
  </FloatingWrapper>
</template>
