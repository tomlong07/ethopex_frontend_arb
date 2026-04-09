<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BudgetOptions } from '@/options/campaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  width: {
    type: String,
    default: 'w-40',
  },
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.budget = 0
    } else {
      props.campaign.budget = undefined
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Budget" rounded v-if="props.campaign.IsAPI()">
    <div class="flex-1 min-w-0">
      <n-input-group>
        <n-select
          v-if="!props.campaign.IsTrafficPocPoc()"
          v-model:value="props.campaign.budget_type"
          :options="BudgetOptions"
          class="w-2/5"
          placeholder="Budget type"
        />
        <n-input-number
          v-model:value="props.campaign.budget"
          :precision="2"
          class="w-2/5"
          style="flex: 1"
        >
          <template #prefix> $ </template>
        </n-input-number>
      </n-input-group>
    </div>
  </FloatingWrapper>
</template>
