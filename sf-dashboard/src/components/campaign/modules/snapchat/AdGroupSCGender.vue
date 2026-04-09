<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, adGroups } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { linkField } from './helpers'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adGroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const genderOptions = ref<SelectOption[]>([
  { label: 'All', value: 'all' },
  { label: 'Male', value: 'MALE' },
  { label: 'FeMale', value: 'FEMALE' },
])

const genderModel = linkField<string | null>('gender', [() => props.adGroup])
</script>

<template>
  <FloatingWrapper name="Gender" rounded>
    <div class="border rounded-md p-2 pt-3 w-fit">
      <n-radio-group v-model:value="genderModel">
        <n-radio-button
          v-for="(o, index) in genderOptions"
          :key="index"
          :value="o.value"
          :label="(o.label as string)"
        />
      </n-radio-group>
    </div>
  </FloatingWrapper>
</template>
