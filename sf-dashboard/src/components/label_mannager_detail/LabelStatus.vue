<script setup lang="ts">
import labelManagerDetail from '@/store/details/LabelManagerDetail'

import CustomSwitch from '../common/CustomSwitch.vue'

const uselabelManagerDetail = labelManagerDetail()
</script>

<template>
  <div class="flex items-center my-4 gap-5">
    <div class="font-bold text-xs">Status</div>
    <div>
      <CustomSwitch
        v-model="uselabelManagerDetail.dataConfig.status"
        :disabled="
          uselabelManagerDetail.isLoading || uselabelManagerDetail.isDisable
        "
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
