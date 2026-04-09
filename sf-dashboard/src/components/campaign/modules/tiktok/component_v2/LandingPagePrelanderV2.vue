<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ONOFF } from '@/enum/campaign'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { CampaignContext } from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const isLoading = ref(true)
const landingOptions = ref<SelectOption[]>([])

const name = 'Prelander Landing'

const isShow = computed(() => {
  const isDemand =
    props.data.campaign.IsDemandAdsense() || props.data.campaign.IsDemandBing1()

  const isPrelandingOn = props.data.campaign.prelanding === ONOFF.ON

  return isDemand && isPrelandingOn
})

const fetchLandingPageByDemand = async (q = '') => {
  isLoading.value = true

  // const res = await ctr_landing_page.GetLandingPages({
  //   q,
  //   demand_source: 'adsense',
  //   prelander: 'off',
  // })

  const res = await ctr_filter_v2.FilterLandingPage(
    {
      q: q,
      f: props.data.campaign.prelander_landing
        ? String(props.data.campaign.prelander_landing)
        : undefined,
    },

    {
      filter: { demand_source: 'adsense', prelander: 'on' },
    }
  )

  landingOptions.value = res?.data || []

  isLoading.value = false
}

const handleLandingSearch = debounceV2(async (q: string = '') => {
  fetchLandingPageByDemand(q)
}, 300)

const renderLandingLabel = (option: SelectOption) => {
  const name =
    typeof option.label === 'string' ? option.label : String(option?.value)

  const label = /^\d/.test(name) ? name : `${option?.value ?? ''}: ${name}`

  return option
    ? h('div', { class: 'flex justify-between w-full' }, [
        h('div', {
          innerHTML: label,
          style:
            'width: 80%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;',
        }),
        h('div', {
          innerHTML: `${((option.cvr as number) ?? 0).toFixed(2)}%`,
        }),
      ])
    : name
}

const isDisabled = computed(() => {
  if (
    props.data.FreezeData.isEditPage() &&
    !props.data.campaign.traffic_source_id
  )
    return false

  if (props.data.campaign.IsCloneCampaign()) {
    return true
  }

  return (
    props.data.FreezeData.isClonePage(props.data.campaign) ||
    !props.data.campaign.account_supply_id ||
    !props.data.campaign.demand_source ||
    // (FreezeData.isEditPage() && campaign.IsDirectOn())
    props.data.FreezeData.isEditPage() //Khánh bảo thế //tất cả trường hợp
  )
})

watch(
  () => isShow.value,
  (visible) => {
    if (visible) {
      fetchLandingPageByDemand()
      return
    }

    props.data.campaign.prelander_landing = null
  }
)

onMounted(() => {
  if (isShow.value) fetchLandingPageByDemand()
})
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <n-select
      v-model:value="props.data.campaign.prelander_landing"
      filterable
      remote
      clearable
      :placeholder="name"
      :loading="isLoading"
      :disabled="isDisabled"
      :render-label="renderLandingLabel"
      :options="landingOptions"
      @search="handleLandingSearch"
    />
  </FloatingWrapper>
</template>
