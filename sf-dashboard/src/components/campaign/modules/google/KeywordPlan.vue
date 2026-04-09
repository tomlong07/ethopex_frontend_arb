<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { ctr_report } from '@/services/ctr_report'

const props = defineProps({
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
  return props.campaign?.location?.value?.length &&
    props.campaign?.account_supply_id
    ? true
    : false
})

const addKeywordPlan = async () => {
  if (props.campaign.keyword_plan == '') {
    return
  }

  if (props.campaign?.language) {
    isLoading.value = true
    const keywordPlanResult = await ctr_report.GetKeyWordPlan({
      keyword: props.campaign.keyword_plan,
      account: props.campaign.account_supply_id,
      language: props.campaign?.language[0],
      location: props.campaign.location?.value
        ? props.campaign.location.value[0]
        : '',
    })
    if (keywordPlanResult?.status) {
      let keywordggsearch = ''
      for (let index = 0; index < keywordPlanResult.data.length; index++) {
        let element = keywordPlanResult.data[index].text.trim()
        if (element !== '') {
          keywordggsearch += element
          if (index < keywordPlanResult.data.length - 1) {
            keywordggsearch += '\n'
          }
        }
      }
      props.campaign.keywords_gg_search = keywordggsearch
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
      props.campaign.keyword_plan = undefined
    }
  }
)
</script>

<template>
  <div
    class="flex items-center gap-2"
    v-if="props.campaign.IsGGSearch() && props.campaign.keyword_plan"
  >
    <div class="w-40 font-bold">Keyword Plan</div>
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <n-input
        v-model:value="props.campaign.keyword_plan"
        type="textarea"
        rows="1"
        placeholder="Enter products or services closely related to your business"
        :disabled="!isDisableKeywordPlan || props.FreezeData.isEditPage()"
      />
      <n-button
        color="#f43f5e"
        type="default"
        @click="addKeywordPlan"
        :loading="isLoading"
        :disabled="!isDisableKeywordPlan || props.FreezeData.isEditPage()"
      >
        Add
      </n-button>
    </div>
  </div>
</template>
