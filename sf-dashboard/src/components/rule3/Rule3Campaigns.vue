<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import BulkEntry from '@/components/common/BulkEntry.vue'
import { debounceV2 } from '@/utils'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { INEX } from '@/enum/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'

const ruleStoreV3 = useRuleStoreV3()

const name = 'Campaigns'

const isShow = computed(() => {
  if (ruleStoreV3.isLoading) return false
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign()
  )
})

const renderLabel = (option: SelectOption) => {
  return h('span', {
    title: option.label,
    innerHTML: option.label || option.value,
  })
}

const statusAll = computed<boolean>(() => {
  return !(
    ruleStoreV3.ruleV3.apply_campaigns?.length ===
    ruleStoreV3.campaignOptions?.length
  )
})

const textAll = computed<string>(() => {
  if (statusAll.value) {
    return 'Select'
  }

  return 'Unselect'
})

const fetchCampaigns = async (q = '') => {
  ruleStoreV3.loadingCampaign = true

  const response = await ctr_filter_v2.FilterCampaign({
    q,
    f: ruleStoreV3.ruleV3.apply_campaigns?.join(','),
  })
  const campaigns: SelectOption[] = response?.data || []

  ruleStoreV3.campaignOptions = campaigns
  ruleStoreV3.campaignMapName = Object.fromEntries(
    campaigns.map(({ value, label }) => [value, label])
  )

  ruleStoreV3.loadingCampaign = false
}
const campaignOptionShow = computed<SelectOption[]>(() =>
  Object.entries(ruleStoreV3.campaignMapName).map(([value, label]) => ({
    value: Number(value),
    label,
  }))
)

const handleAll = () => {
  ruleStoreV3.loadingCampaign = true
  if (statusAll.value) {
    ruleStoreV3.ruleV3.apply_campaigns?.splice(0)
    ruleStoreV3.ruleV3.apply_campaigns?.push(
      ...(ruleStoreV3.campaignOptions?.map((i) => i.value) as number[])
    )
  } else {
    ruleStoreV3.ruleV3.apply_campaigns = []
  }

  ruleStoreV3.loadingCampaign = false
}

onMounted(() => {
  if (isShow.value) {
    fetchCampaigns()
  }
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.apply_type) {
        ruleStoreV3.ruleV3.apply_type = INEX.INCLUDE
      }
      if (!ruleStoreV3.ruleV3.apply_campaigns) {
        ruleStoreV3.ruleV3.apply_campaigns = []
      }
      fetchCampaigns()
    } else {
      ruleStoreV3.ruleV3.apply_campaigns = []
      ruleStoreV3.ruleV3.apply_type = null
    }
  }
)

const handleSearch = debounceV2(async (q: string = '') => {
  fetchCampaigns(q)
}, 300)

const initShowModal = () => {
  ruleStoreV3.typeModal = 'campaign'

  ruleStoreV3.multipleEntries =
    ruleStoreV3.ruleV3.apply_campaigns?.join('\n') || ''

  ruleStoreV3.showModal = true
}

const clear = (index: number) => {
  if (index === -1) return
  ruleStoreV3.ruleV3.apply_campaigns?.splice(index, 1)
}
</script>

<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <!-- <div class="w-32 font-bold">{{ name }}</div> -->
    <div class="flex flex-col flex-1 gap-1">
      <div class="flex w-full items-center gap-2">
        <div class="flex flex-1 min-w-0 items-center gap-2">
          <FloatingWrapper :name="name">
            <n-select
              class="w-full"
              v-model:value="ruleStoreV3.ruleV3.apply_campaigns"
              multiple
              filterable
              clearable
              :placeholder="''"
              :render-label="renderLabel"
              :loading="ruleStoreV3.loadingCampaign"
              :options="campaignOptionShow"
              :max-tag-count="0"
              :consistent-menu-width="false"
              @search="handleSearch"
            />
          </FloatingWrapper>
          <div class="w-32 shrink-0">
            <CustomSwitch
              v-model="(ruleStoreV3.ruleV3.apply_type as INEX)"
              type="inex"
              true-label="Include"
              false-label="Exclude"
              size="small"
            />
          </div>
          <n-button
            size="small"
            round
            class="w-24 shrink-0"
            :disabled="ruleStoreV3.loadingCampaign"
            color="#49a0f9"
            @click="handleAll"
            >{{ textAll }} All
          </n-button>
          <BulkEntry
            round
            size="small"
            text="campaign"
            @click-action="initShowModal"
            class="w-32 shrink-0"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="isShow && ruleStoreV3.ruleV3.apply_campaigns?.length"
    class="flex items-center flex-wrap gap-2 max-h-48 overflow-y-auto"
  >
    <n-tag
      v-for="(miniData, index) in ruleStoreV3.ruleV3.apply_campaigns"
      :key="index"
      closable
      @close="clear(index)"
      >{{ ruleStoreV3.campaignMapName[miniData] || miniData }}
    </n-tag>
  </div>
</template>
