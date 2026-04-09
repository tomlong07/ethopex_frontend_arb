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

const isShow = computed(() => {
  if (!props.job.isRecommended) return false

  return true
})

const name = `Recommend Label`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-show="isShow">
    <n-input
      v-model:value="props.job.recommendLabel"
      :placeholder="name"
      maxlength="500"
    />
  </FloatingWrapper>
</template>
