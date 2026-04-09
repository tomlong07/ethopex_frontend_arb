<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePromtDetail = PromtDetail()
</script>
<template>
  <div class="flex items-center">
    <div class="w-full">
      <FloatingWrapper name="Name" :required="true">
        <n-input
          v-model:value="usePromtDetail.dataConfig.name"
          :loading="usePromtDetail.statusData.isLoading"
          placeholder="Enter name"
          maxlength="100"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
