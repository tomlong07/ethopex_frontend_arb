<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { budgetOptions } from '@/options/campaign';
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  width: {
    type: String,
    default: 'w-40',
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <FloatingWrapper name="Budget">
      <div class="flex-1 min-w-0">
        <n-input-group>
          <n-select
            v-model:value="props.adgroup.bidding"
            :options="budgetOptions"
            class="w-2/5"
            placeholder="Budget type"
          />
          <n-input-number
            v-model:value="props.adgroup.budget"
            :precision="2"
            class="w-2/5"
            style="flex: 1"
          >
            <template #prefix> $ </template>
          </n-input-number>
        </n-input-group>
      </div>
    </FloatingWrapper>
  </div>
</template>
