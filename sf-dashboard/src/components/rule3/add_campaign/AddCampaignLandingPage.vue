<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_landing_page } from '@/services/ctr_landing_page'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'
const ruleStoreV3 = useRuleStoreV3()

const name = `Landing Page`
const isLoading = ref<boolean>(false)
const landingOptions = ref<SelectOption[]>([])

const isShow = computed(() => {
  const campaign = ruleStoreV3.ruleV3.add_campaign

  return (
    !ruleStoreV3.ruleV3.isDataFromListCampaign() &&
    campaign?.IsLandingTypeCustom?.() &&
    campaign?.IsOffS2S?.()
  )
})

const slugLanding = computed<string>(() => {
  const found = landingOptions.value.find(
    (element: any) =>
      element.id === ruleStoreV3.ruleV3.add_campaign.landing_page
  )

  return found ? (found.slug as string) || '' : ''
})

const handleLandingSearch = debounceV2(async (q: string = '') => {
  fetchLandingPageByDemand(q)
}, 300)

const fetchLandingPageByDemand = async (
  q: string = '',
  ad_account?: string
) => {
  isLoading.value = true
  const landingResult = await ctr_landing_page.GetLandingPages({
    q: q,
    demand_source: 'adsense',
    // ad_account: search_ad_account.value || campaign.value.account,
  })
  landingOptions.value = landingResult?.data?.landing_pages || []
  isLoading.value = false
}

const renderLandingLabel = (option: any) => {
  if (String(option.id) === option.label) {
    return option.label
  }

  return h('div', { class: 'flex justify-between w-full' }, [
    h('div', {
      innerHTML: `${
        (option.name as any).match(/^\d/)
          ? option.name
          : `${option.id}: ${option.name}`
      }`,
      style:
        'width: 80%; text-overflow: ellipsis;white-space: nowrap;overflow: hidden;',
    }),
    h('div', {
      innerHTML: `${option?.cvr ? option?.cvr?.toFixed(2) : 0}%`,
    }),
  ])
}

const editLandingPage = () => {
  if (!ruleStoreV3.ruleV3.add_campaign.landing_page) {
    return
  }

  window.open(
    `/landing_page/${ruleStoreV3.ruleV3.add_campaign.landing_page}`,
    '_blank'
  )
}

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      fetchLandingPageByDemand()
    } else {
      ruleStoreV3.ruleV3.add_campaign.landing_page = null
    }
  }
)

onMounted(async () => {
  if (isShow.value) {
    fetchLandingPageByDemand()
  }
})
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-input-group>
      <n-select
        v-model:value="ruleStoreV3.ruleV3.add_campaign.landing_page"
        filterable
        remote
        clearable
        :placeholder="''"
        value-field="id"
        :loading="isLoading"
        :render-label="renderLandingLabel"
        :options="landingOptions"
        @search="handleLandingSearch"
      />

      <n-button
        v-if="slugLanding"
        color="#f43f5e"
        type="default"
        @click="editLandingPage"
      >
        Edit
      </n-button>
    </n-input-group>
  </FloatingWrapper>
</template>
