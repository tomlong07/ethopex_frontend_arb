<script setup lang="ts">
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'
import BulkEntry from '@/components/common/BulkEntry.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()

const name = 'Origin Campaigns'

const campaignListOptions = ref<SelectOption[]>([])
const isLoading = ref<boolean>(false)
const isFirst = ref(false)

const fetchCampaignListOptions = async (q?: string) => {
  isLoading.value = true

  const f = ruleStoreV3.ruleV3.add_campaign.list_campaign_origin?.length
    ? ruleStoreV3.ruleV3.add_campaign.list_campaign_origin.join(',')
    : ''
  const result = await ctr_filter_v2.FilterCampaign({
    q: q,
    f: f,
    fi: isFirst.value ? '1' : undefined,
  })

  if (isFirst.value) isFirst.value = false
  campaignListOptions.value = result?.data || []
  isLoading.value = false
}

const handleSearchCampaignList = debounceV2(async (q: string) => {
  await fetchCampaignListOptions(q)
}, 300)

const initShowModal = () => {
  ruleStoreV3.typeModal = 'origin_campaigns'

  ruleStoreV3.multipleEntries =
    ruleStoreV3.ruleV3.add_campaign.list_campaign_origin?.join('\n') || ''

  ruleStoreV3.showModal = true
}

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isDataFromListCampaign() &&
    ruleStoreV3.ruleV3.add_campaign.IsFixed()
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.add_campaign.list_campaign_origin) {
        ruleStoreV3.ruleV3.add_campaign.list_campaign_origin = []
      }
      fetchCampaignListOptions()
    } else {
      ruleStoreV3.ruleV3.add_campaign.list_campaign_origin = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    fetchCampaignListOptions()
  }
})
</script>

<template>
 
  <div class="flex items-center" v-if="isShow">
    <div class="flex-1 min-w-0 flex">
      <FloatingWrapper :name="name">
        <n-select
          v-model:value="ruleStoreV3.ruleV3.add_campaign.list_campaign_origin"
          :options="campaignListOptions"
          :loading="isLoading"
          :placeholder="''"
          multiple
          remote
          filterable
          clearable
          :max-tag-count="1"
          @search="handleSearchCampaignList"
        />
      </FloatingWrapper>
      </div class="mt-1">
        <BulkEntry
          @click-action="initShowModal" 
          round
          size="small"
        />
        <div>
    </div>
  </div> 
</template>
