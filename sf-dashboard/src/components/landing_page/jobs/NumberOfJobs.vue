<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { CompanyInfo } from '@/types/components/landing'

const props = defineProps({
  company: {
    type: Object as () => CompanyInfo,
    required: true,
  },
})

const name = `Number of Jobs`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded>
    <n-input
      v-model:value="props.company.numberOfJobs"
      :placeholder="name"
      maxlength="500"
    />
  </FloatingWrapper>
</template>
