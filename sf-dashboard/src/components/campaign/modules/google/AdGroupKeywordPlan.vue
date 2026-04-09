<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_report } from '@/services/ctr_report'
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const isLoading = ref<boolean>(false)

const isDisableKeywordPlan = computed<boolean>(() => {
  return (
    !props.campaign?.location?.value?.length ||
    !props.campaign?.account_supply_id ||
    !!props.adgroup.id
  )
})

const addKeywordPlan = async () => {
  if (!props.adgroup.keyword_plan) return

  if (props.campaign?.language) {
    isLoading.value = true
    const keywordPlanResult = await ctr_report.GetKeyWordPlan({
      keyword: props.adgroup.keyword_plan,
      account: props.campaign.account_supply_id,
      language: props.campaign?.language[0],
      location: props.campaign.location?.value
        ? props.campaign.location.value[0]
        : '',
    })
    if (keywordPlanResult?.status) {
      props.adgroup.keywords_gg_search = keywordPlanResult.data
        ?.map((item: any) => item.text.trim())
        .filter((text: string) => text !== '')
        .join('\n')
    }
    isLoading.value = false
  }
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsGGSearch(),
  async (newValue, oldValue) => {
    if (newValue) {
    } else {
      if (props.campaign.ad_groups) {
        props.adgroup.keyword_plan = undefined
      }
    }
  }
)
</script>

<template>
  <FloatingWrapper
    name="Keyword Plan"
    rounded
    v-if="props.campaign.IsGGSearch()"
  >
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <n-input
        v-model:value="props.adgroup.keyword_plan"
        type="textarea"
        rows="1"
        placeholder="Enter products or services closely related to your business"
        :disabled="isDisableKeywordPlan"
      />
      <n-button
        color="#f43f5e"
        type="default"
        @click="addKeywordPlan"
        :loading="isLoading"
        :disabled="isDisableKeywordPlan"
      >
        Add
      </n-button>
    </div>
  </FloatingWrapper>
</template>
