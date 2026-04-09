<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePromtDetail = PromtDetail()
</script>
<template>
  <div class="flex items-center">
    <div class="w-full">
      <FloatingWrapper name="Prompt">
        <n-input
          v-model:value="usePromtDetail.dataConfig.prompt"
          :loading="usePromtDetail.statusData.isLoading"
          type="textarea"
          placeholder="Enter prompt"
          :autosize="{
            minRows: 10,
            maxRows: 35,
          }"
          style="resize: both"
          maxlength="50000"
          show-count
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
