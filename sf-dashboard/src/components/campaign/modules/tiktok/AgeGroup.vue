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
    if (props.adgroup?.age_groups?.includes('AGE_UNLIMITED')) {
      otherDisable = true
    } else {
      ageUnlimitDisable = true
    }
  }

  return [
    { label: 'Unlimited', value: 'AGE_UNLIMITED', disabled: ageUnlimitDisable },
    { label: '13-17', value: 'AGE_13_17', disabled: otherDisable },
    { label: '18-24', value: 'AGE_18_24', disabled: otherDisable },
    { label: '25-34', value: 'AGE_25_34', disabled: otherDisable },
    { label: '35-44', value: 'AGE_35_44', disabled: otherDisable },
    { label: '45-54', value: 'AGE_45_54', disabled: otherDisable },
    { label: '55+', value: 'AGE_55_100', disabled: otherDisable },
  ]
})
watch(
  () => props.campaign.IsSmart(),
  (newValue, oldValue) => {
    if (newValue) {
      props.adgroup.age_groups = undefined
    }
  }
)

const name = 'Age Group'
</script>

<template>
  <div class="flex items-center gap-2" v-if="!props.campaign.IsSmart()">
    <FloatingWrapper :name="name" rounded required>
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
