<script setup lang="ts">
import CustomSwitch from '../common/CustomSwitch.vue'
const props = defineProps({
  name: { type: String, default: 'Status' },
  disabled: { type: Boolean, default: false },
})

const value = defineModel<any>('value')
</script>

<template>
  <div class="flex gap-2 items-center">
    <div class="text-xs font-bold">{{ props.name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="value"
        :disabled="props.disabled"
        true-label="On"
        false-label="Off"
        size="small"
        type="onoff"
      />
    </div>
  </div>
</template>
