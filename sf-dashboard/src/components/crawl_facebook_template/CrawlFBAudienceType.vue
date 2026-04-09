<script setup lang="ts">
import { PLACEMENT_TYPE } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const modelValue = defineModel<string | null>()
</script>

<template>
  <FloatingWrapper name="Type" rounded required>
    <n-radio-group class="border rounded-md p-2" v-model:value="modelValue">
      <div class="flex gap-2">
        <n-radio :value="PLACEMENT_TYPE.ADVANTAGE" class="flex">
          <div class="text-gray-600">Advantage+</div>
        </n-radio>
        <n-radio :value="PLACEMENT_TYPE.MANUAL" class="flex">
          <div class="text-gray-600">Manual</div>
        </n-radio>
      </div>
    </n-radio-group>
  </FloatingWrapper>
</template>
