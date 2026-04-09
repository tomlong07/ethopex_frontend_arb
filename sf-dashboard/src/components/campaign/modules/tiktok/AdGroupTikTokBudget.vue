<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { budgetOptionsTT } from '@/options/campaign'
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

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.adgroup.budget = 0
    } else {
      props.adgroup.budget = undefined
    }
  }
)
watch(
  () => props.campaign.IsSmart(),
  async (newValue, oldValue) => {
    if (newValue) {
      Object.assign(props.adgroup, {
        budget: undefined,
        bidding: undefined,
      })
    }
  }
)
const name = 'Budget'
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    v-if="
      props.campaign.IsAPI() &&
      !props.campaign.IsSmart() &&
      props.campaign.budget_optimize_on !== 'on'
    "
  >
    <n-input-group>
      <n-select
        v-model:value="props.adgroup.bidding"
        :options="budgetOptionsTT"
        class="w-2/5"
        placeholder="Budget type"
        :disabled="
          props.FreezeData.isEditPage() &&
          !!props.adgroup.id &&
          !!props.adgroup.ad_group_id
        "
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
  </FloatingWrapper>
</template>
