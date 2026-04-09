<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePromtDetail = PromtDetail()
</script>
<template>
  <div class="flex items-center">
    <div class="w-full">
      <FloatingWrapper name="Schema Response">
        <n-input
          v-model:value="usePromtDetail.dataConfig.schema_response"
          :loading="usePromtDetail.statusData.isLoading"
          type="textarea"
          placeholder="Enter schema response"
          :autosize="{
            minRows: 5,
            maxRows: 20,
          }"
          maxlength="50000"
          show-count
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
