<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { SendTypeOptions } from '@/options/prompt'
const usePromtDetail = PromtDetail()
</script>
<template>
  <div class="flex items-center">
    <div class="w-full">
      <FloatingWrapper name="Send Type">
        <n-select
          :loading="usePromtDetail.selectData.loadingModel"
          v-model:value="usePromtDetail.dataConfig.send_type"
          :options="SendTypeOptions"
          placeholder=""
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
