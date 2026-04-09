<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  index: {
    type: Number,
    required: true,
  },
})

const genderOptions = ref<SelectOption[]>([
  { label: 'All', value: 'genderAll' },
  { label: 'Male', value: 'genderMale' },
  { label: 'FeMale', value: 'genderFemale' },
])

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI()
})
</script>

<template>
  <FloatingWrapper
    name="Gender"
    rounded
    required
    v-if="isShow && props.campaign.ad_groups"
  >
    <div class="border rounded-md p-2 pt-3 w-fit">
      <n-radio-group
        v-model:value="props.campaign.ad_groups[props.index].gender"
      >
        <n-radio-button
          v-for="(o, index) in genderOptions"
          :key="index"
          :value="o.value"
          :label="(o.label as string)"
          :disabled="campaign.categories?.length ? true : false"
        />
      </n-radio-group>
    </div>
  </FloatingWrapper>
</template>
