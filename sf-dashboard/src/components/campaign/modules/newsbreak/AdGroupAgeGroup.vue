<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { adGroups, campaignTypeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const ageGroupOptions = computed<SelectOption[]>(() => {
  let ageUnlimitDisable = false
  let otherDisable = false
  if (props.adgroup?.age_groups && props.adgroup?.age_groups.length) {
    if (props.adgroup?.age_groups?.includes('all')) {
      otherDisable = true
    } else {
      ageUnlimitDisable = true
    }
  }

  return [
    { label: 'Unlimited', value: 'all', disabled: ageUnlimitDisable },
    { label: '18-30', value: '18-30', disabled: otherDisable },
    { label: '31-44', value: '31-44', disabled: otherDisable },
    { label: '45-64', value: '45-64', disabled: otherDisable },
    { label: '65+', value: '65+', disabled: otherDisable },
  ]
})

const name = 'Age Group'
</script>

<template>
  <div class="flex items-center gap-2">
    <FloatingWrapper :name="name">
      <div class="flex-1 min-w-0 flex items-center">
        <n-select
          v-model:value="props.adgroup.age_groups"
          multiple
          clearable
          :placeholder="name"
          :options="ageGroupOptions"
        />
      </div>
    </FloatingWrapper>
  </div>
</template>
