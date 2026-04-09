<script setup lang="ts">
import PixelTriggersDetail from '@/store/details/usePixelTriggersDetail'
const usePixelTriggersDetail = PixelTriggersDetail()
import CustomSwitch from '../common/CustomSwitch.vue'
</script>
<template>
  <div class="flex items-center gap-5">
    <div class="font-bold text-xs">Status</div>
    <div>
      <CustomSwitch
        v-model="usePixelTriggersDetail.pixelConfig.status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
