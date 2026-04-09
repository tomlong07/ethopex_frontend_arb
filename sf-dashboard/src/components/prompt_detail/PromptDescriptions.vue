<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePromtDetail = PromtDetail()
</script>
<template>
  <div class="flex items-center">
    <div class="w-full">
      <FloatingWrapper name="Description">
        <n-input
          v-model:value="usePromtDetail.dataConfig.description"
          :loading="usePromtDetail.statusData.isLoading"
          type="textarea"
          placeholder="Enter description"
          maxlength="10000"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
