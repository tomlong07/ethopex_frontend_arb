<script setup lang="ts">
import { INEX } from '@/enum/campaign'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { debounceV2 } from '@/utils'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'

const ruleStoreV3 = useRuleStoreV3()

onMounted(() => {
  ruleStoreV3.fetchCampaignTags()

  if (!ruleStoreV3.ruleV3.apply_type_delivery_status) {
    ruleStoreV3.ruleV3.apply_type_delivery_status = INEX.INCLUDE
  }
})

if (ruleStoreV3.campaignTagsSearch.length > 0) {
  ruleStoreV3.campaignTags = ruleStoreV3.campaignTagsSearch
}

const handleSearch = debounceV2(async (q: string = '') => {
  ruleStoreV3.fetchCampaignTags(q)
}, 300)

const name = `Campaign Tags`
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex gap-2 items-center flex-1 min-w-0">
      <FloatingWrapper :name="name">
        <n-select
          v-model:value="ruleStoreV3.ruleV3.apply_tag_campaign"
          :options="ruleStoreV3.campaignTags"
          :loading="ruleStoreV3.loadingCampaignTags"
          :placeholder="''"
          multiple
          filterable
          clearable
          max-tag-count="responsive"
          @search="handleSearch"
        />
      </FloatingWrapper>
      <div class="w-32 shrink-0">
        <CustomSwitch
          v-model="(ruleStoreV3.ruleV3.apply_tag_type as INEX)"
          type="inex"
          true-label="Include"
          false-label="Exclude"
          size="small"
        />
      </div>
    </div>
  </div>
</template>
