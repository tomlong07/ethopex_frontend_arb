<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { adGroups, FreezeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { conversionLocationOptions } from '@/options/campaign'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const name = 'Conversion location'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      v-model:value="props.adgroup.conversion_location"
      :placeholder="name"
      :disabled="
        props.FreezeData.isEditPage() &&
        !!props.adgroup.id &&
        !!props.adgroup.ad_group_id
      "
      :options="conversionLocationOptions"
    />
  </FloatingWrapper>
</template>
