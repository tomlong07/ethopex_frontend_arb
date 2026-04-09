<script setup lang="ts">
import { creativeStruct } from '@/types/components/campaign-v2'
import { AD_SETUP } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { adSetupOptions } from '@/options/campaign'

const props = defineProps({
  adcreative: {
    type: Object as () => creativeStruct,
    required: true,
  },

  class1: {
    type: String,
    default: 'w-40 font-bold',
  },

  class2: {
    type: String,
    default: 'flex-1 min-w-0',
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const name = 'Ad setup'
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <n-select
      :disabled="disabled"
      v-model:value="props.adcreative.ad_setup"
      :placeholder="name"
      :options="adSetupOptions"
    />
  </FloatingWrapper>
</template>
