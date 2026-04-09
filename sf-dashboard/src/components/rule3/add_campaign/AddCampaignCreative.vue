<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'
import { renderCreativeLabel } from '@/plugins/reuseable'
import { SelectOption } from 'naive-ui'
import { ctr_creative } from '@/services/ctr_creative'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()

const name = 'Creative'
const creativeOptions = ref<SelectOption[]>([])

const isLoading = ref(false)

const fetchCreatives = async (q: string = '') => {
  isLoading.value = true
  const creativeOptionsResult = await ctr_creative.GetAllCreative({
    params: {
      q: q,
      ts: 'google',
      type: ruleStoreV3.ruleV3.add_campaign.campaign_type,
    },
  })
  creativeOptions.value = creativeOptionsResult?.data?.creatives || []

  isLoading.value = false
}

watch(
  () => ruleStoreV3.ruleV3.isDataFromListCampaign(),
  (newValue) => {
    if (newValue) {
      ruleStoreV3.ruleV3.add_campaign.creative = null
    } else {
      fetchCreatives()
    }
  }
)

const openCreative = () => {
  if (ruleStoreV3.ruleV3?.add_campaign?.creative) {
    window.open(
      `/creative/${ruleStoreV3.ruleV3.add_campaign.creative}`,
      '_blank'
    )
  }
}

onMounted(() => {
  if (!ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    fetchCreatives()
  }
})
</script>

<template>
  <FloatingWrapper
    :name="name"
    v-if="!ruleStoreV3.ruleV3.isDataFromListCampaign()"
  >
    <n-input-group>
      <n-select
        v-model:value="ruleStoreV3.ruleV3.add_campaign.creative"
        filterable
        remote
        value-field="id"
        label-field="name"
        :loading="isLoading"
        :placeholder="''"
        :render-label="renderCreativeLabel"
        :options="creativeOptions"
        @search="fetchCreatives"
      />
      <n-button
        v-if="ruleStoreV3.ruleV3?.add_campaign?.creative !== 0"
        color="#f43f5e"
        @click="openCreative"
        round
      >
        Open
      </n-button>
    </n-input-group>
  </FloatingWrapper>
</template>
