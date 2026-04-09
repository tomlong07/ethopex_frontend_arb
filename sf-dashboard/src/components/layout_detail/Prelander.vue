<script setup lang="ts">
import LayoutDetail from '@/store/details/LayoutDetail'
import CustomSwitch from '../common/CustomSwitch.vue'
const useLayoutDetail = LayoutDetail()
</script>
<template>
  <div class="sm:flex gap-2">
    <div class="w-32">
      <label class="font-bold text-xs">Prelander</label>
    </div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="useLayoutDetail.layoutConfig.prelander"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
