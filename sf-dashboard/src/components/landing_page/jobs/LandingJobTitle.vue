<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { prelanderJobs } from '@/types/components/landing'

const props = defineProps({
  job: {
    type: Object as () => prelanderJobs,
    required: true,
  },
})

const name = `Title`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded>
    <n-input
      v-model:value="props.job.title"
      :placeholder="name"
      maxlength="500"
    />
  </FloatingWrapper>
</template>
