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
  if (props.configs.IsTheme1() && !props.job.isRecommended) return true

  return false
})

const name = `Time Posted`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-show="isShow">
    <n-input
      v-model:value="props.job.timePosted"
      :placeholder="name"
      maxlength="500"
      v-show="isShow"
    />
  </FloatingWrapper>
</template>
