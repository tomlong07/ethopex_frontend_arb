<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { adGroups } from '@/types/components/campaign-v2'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const genderOptions = ref<SelectOption[]>([
  { label: 'All', value: 'all' },
  { label: 'Male', value: 'male' },
  { label: 'FeMale', value: 'female' },
  { label: 'Notdisclosed', value: 'notdisclosed' },
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="text-xs font-bold text-gray-400">Gender</div>
    <div class="flex-1 min-w-0 flex items-center">
      <n-radio-group v-model:value="props.adgroup.gender">
        <n-radio-button
          v-for="(o, index) in genderOptions"
          :key="index"
          :value="o.value"
          :label="(o.label as string)"
        />
      </n-radio-group>
    </div>
  </div>
</template>
