<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BudgetOptions } from '@/options/campaign'
import { campaignTypeClass, adGroups } from '@/types/components/campaign-v2'
import { linkField } from './helpers'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  width: {
    type: String,
    default: 'w-40',
  },

  adGroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const budgetModel = linkField<number | null>('budget', [() => props.adGroup])

const budgetTypeModel = linkField<string | null>('budget_type', [
  () => props.adGroup,
])

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  (isApi) => {
    if (isApi) {
      if (budgetModel.value == null) {
        budgetModel.value = 0
      }
    } else {
      budgetModel.value = null
      budgetTypeModel.value = null
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Budget" rounded v-if="props.campaign.IsAPI()">
    <div class="flex-1 min-w-0">
      <n-input-group>
        <n-select
          v-model:value="budgetTypeModel"
          :options="BudgetOptions"
          class="w-2/5"
          placeholder="Budget type"
        />
        <n-input-number
          v-model:value="budgetModel"
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
