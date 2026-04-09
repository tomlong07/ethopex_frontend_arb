<script setup lang="ts">
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import useRuleStoreV3 from '@/store/details/ruleV3'

const ruleStoreV3 = useRuleStoreV3()

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.search_network = false
      ruleStoreV3.ruleV3.add_campaign.display_network = false
    }
  }
)
</script>

<template>
  <n-card
    title="Networks"
    class="card-flex-gap-4"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <div class="flex items-center gap-2">
      <div class="w-1/6 font-bold">Search Network</div>
      <div class="w-5/6">
        <CustomSwitch
          v-model="ruleStoreV3.ruleV3.add_campaign.search_network"
          type="boolean"
          true-label="Include"
          false-label="Exclude"
        />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="w-1/6 font-bold">Display Network</div>
      <div class="w-5/6">
        <CustomSwitch
          v-model="ruleStoreV3.ruleV3.add_campaign.display_network"
          type="boolean"
          true-label="Include"
          false-label="Exclude"
        />
      </div></div
  ></n-card>
</template>
