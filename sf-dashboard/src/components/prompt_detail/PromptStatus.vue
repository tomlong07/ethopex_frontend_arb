<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'

import CustomSwitch from '../common/CustomSwitch.vue'

const usePromtDetail = PromtDetail()
</script>
<template>
  <div class="flex items-center gap-5">
    <div class="font-bold text-xs w-12">Status</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="usePromtDetail.dataConfig.status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
