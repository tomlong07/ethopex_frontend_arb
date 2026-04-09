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
  if (props.configs.IsTheme1() && !props.job.isRecommended) return false

  return true
})

const name = `Number Rating`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-show="isShow">
    <n-input-number
      v-model:value="props.job.numberRating"
      :placeholder="name"
      min="0"
      v-show="isShow"
    />
  </FloatingWrapper>
</template>
