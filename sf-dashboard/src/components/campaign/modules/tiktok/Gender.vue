<script setup lang="ts">
import { adGroups } from '@/types/components/campaign-v2'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const genderOptions = ref<{ label: string; value: string }[]>([
  { label: 'All', value: 'GENDER_UNLIMITED' },
  { label: 'Male', value: 'GENDER_MALE' },
  { label: 'FeMale', value: 'GENDER_FEMALE' },
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="text-xs font-bold">Gender</div>
    <n-radio-group v-model:value="props.adgroup.gender">
      <n-radio-button
        v-for="(o, index) in genderOptions"
        :key="index"
        :value="o.value"
        :label="o.label"
      />
    </n-radio-group>
  </div>
</template>
