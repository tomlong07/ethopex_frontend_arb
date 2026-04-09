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

const name = 'Reward'

watch(
  () => props.job.reward,
  (v) => {
    if (v) {
      props.job.isExpired = false
    }
  }
)
</script>
<template>
  <div class="p-2">
    <n-switch v-model:value="props.job.reward">
      <template #checked
        ><span class="text-xs">{{ name }}</span></template
      >
      <template #unchecked
        ><span class="text-xs">{{ name }}</span></template
      >
    </n-switch>
  </div>
</template>
