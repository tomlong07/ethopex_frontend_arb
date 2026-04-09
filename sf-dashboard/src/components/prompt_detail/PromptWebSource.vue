<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { ONOFF } from '@/enum/campaign'
import CustomSwitch from '../common/CustomSwitch.vue'
const modelValue = defineModel<ONOFF | undefined>('value', { required: true })

const props = defineProps({
  class: {
    type: String,
    default: 'w-12',
  },
})
</script>
<template>
  <div class="flex items-center gap-4 w-full">
    <div
      class="font-bold whitespace-nowrap items-center flex gap-1 text-xs"
      :class="props.class"
    >
      Web

      <n-popover trigger="hover">
        <template #trigger>
          <n-button text>
            <template #icon>
              <n-icon size="12" :component="QuestionCircleRegular" />
            </template>
          </n-button>
        </template>
        <span>Search accross the entire internet</span>
      </n-popover>
    </div>
    <CustomSwitch
      v-model="modelValue"
      type="onoff"
      true-label="On"
      false-label="Off"
      size="small"
    />
  </div>
</template>
