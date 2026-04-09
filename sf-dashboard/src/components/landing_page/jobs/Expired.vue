<script setup lang="ts">
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

watch(
  () => props.job.isExpired,
  (v) => {
    if (v) {
      props.job.reward = false
      props.job.buttonText = 'Expired'
    } else {
      props.job.buttonText = 'Continue'
    }
  },
  { immediate: true }
)
const name = 'Expired'
</script>
<template>
  <div class="p-2">
    <n-switch
      v-model:value="props.job.isExpired"
      :disabled="props.job.isRecommended"
    >
      <template #checked
        ><span class="text-xs">{{ name }}</span></template
      >
      <template #unchecked
        ><span class="text-xs">{{ name }}</span></template
      >
    </n-switch>
  </div>
</template>
