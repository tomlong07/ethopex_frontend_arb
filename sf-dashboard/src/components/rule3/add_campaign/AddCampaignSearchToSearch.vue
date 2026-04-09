<script setup lang="ts">
import { ONOFF } from '@/enum/campaign'
import useRuleStoreV3 from '@/store/details/ruleV3'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
const ruleStoreV3 = useRuleStoreV3()
const name = 'Search To Search'

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.search_to_search = null
    } else {
      if (!ruleStoreV3.ruleV3.add_campaign.search_to_search) {
        ruleStoreV3.ruleV3.add_campaign.search_to_search = ONOFF.OFF
      }
    }
  }
)
</script>

<template>
  <div
    class="flex items-center gap-2"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <div class="w-40 font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="ruleStoreV3.ruleV3.add_campaign.search_to_search"
        type="onoff"
        true-label="On"
        false-label="Off"
      />
    </div>
  </div>
</template>
