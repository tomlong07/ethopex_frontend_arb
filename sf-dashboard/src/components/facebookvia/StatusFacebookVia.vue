<script setup lang="ts">
import { useFacebookViaStore } from '@/store/details/useFacebookViaStore'
import CustomSwitch from '../common/CustomSwitch.vue'

const facebookConfig = useFacebookViaStore()
</script>
<template>
  <div class="flex items-center gap-5">
    <div class="font-bold text-xs">Status</div>
    <div>
      <CustomSwitch
        v-model="facebookConfig.dataConfig.status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
