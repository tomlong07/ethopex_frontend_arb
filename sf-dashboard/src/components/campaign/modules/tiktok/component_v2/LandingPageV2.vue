<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { CampaignContext } from '@/types/components/campaign-v2'
import api_v2 from '@/core/api_v2'
import { ONOFF } from '@/enum/campaign'
import { ctr_campaign } from '@/services/ctr_campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const isLoading = ref<boolean>(false)

const landingOptions = ref<SelectOption[]>([])

const renderLandingLabel = (option: SelectOption) => {
  const landingItem = landingOptions.value.find(
    (item: SelectOption) => item.value === option.value
  )
  return landingItem
    ? h('div', { class: 'flex justify-between w-full' }, [
        h('div', {
          innerHTML: `${
            (option.label as any).match(/^\d/)
              ? option.label
              : `${landingItem.value}: ${option.label}`
          }`,
          style:
            'width: 80%; text-overflow: ellipsis;white-space: nowrap;overflow: hidden;',
        }),
        h('div', {
          innerHTML: `${
            landingItem?.cvr ? (landingItem.cvr as number).toFixed(2) : 0
          }%`,
        }),
      ])
    : undefined
}

const isDisabled = computed(() => {
  if (props.data.campaign.category_site_builder === ONOFF.ON) return true
  if (props.data.campaign.IsCloneCampaign()) return true

  if (props.data.campaign.IsCreativeLandingByCreative()) return true

  return (
    props.data.FreezeData.isClonePage(props.data.campaign) ||
    !props.data.campaign.account_supply_id ||
    !props.data.campaign.demand_source ||
    // (FreezeData.isEditPage() && campaign.IsDirectOn())
    props.data.FreezeData.isEditPage() //Khánh bảo thế //tất cả trường hợp
  )
})

const slugLanding = computed<string>(() => {
  if (!props.data.campaign.landing_pages?.id) {
    return ''
  }
  for (let index = 0; index < landingOptions.value.length; index++) {
    if (
      landingOptions.value[index].value == props.data.campaign.landing_pages.id
    ) {
      return (landingOptions.value[index].slug as string) || ''
    }
  }

  return ''
})

const isGetPreview = ref<boolean>(false)

const landingPreviewInput = computed(() => {
  return {
    landing_page_id: props.data.campaign.landing_pages?.id,
    traffic_source: props.data.campaign.traffic_source,
    user_flow: props.data.campaign.user_flow,
    vertical: props.data.campaign.vertical,
  }
})

const previewAd = async () => {
  isGetPreview.value = true
  const result = await ctr_campaign.GetPreview(landingPreviewInput.value)
  isGetPreview.value = false

  if (result?.status && result?.data) {
    window.open(
      result?.data + ` &arb_campaign_id=${props.data.campaign.id}`,
      '_blank'
    )
    return
  }
  window.message.error(
    `Failed to fetch account by demand: ${result?.errors[0].message}`
  )
}

const editLandingPage = () => {
  if (!props.data.campaign.landing_pages?.id) {
    return
  }

  window.open(
    `/landing_page/${props.data.campaign.landing_pages?.id}`,
    '_blank'
  )
}

const searchTimeout = ref<ReturnType<typeof setTimeout>>()

const handleLandingSearch = (query: string) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    fetchLandingPageByDemand({
      q: query,
    })
  }, 300)
}

const blurHandle = () => {
  if (!landingOptions.value.length) {
    ajax()
  }
}

const ajax = async (opts: { q: string; notfound?: boolean } = { q: '' }) => {
  let data = {
    filter: { demand_source: props.data.campaign.demand_source } as Record<
      string,
      any
    >,
  }

  if (props.data.campaign.prelanding === ONOFF.ON) {
    data.filter.prelander = 'off'
  }
  const landingResult = await api_v2.request({
    url: 'filter/landing-page',
    params: {
      q: opts.q,
      f: props.data.campaign.landing_pages?.id
        ? String(props.data.campaign.landing_pages?.id)
        : undefined,
      nf: opts.notfound ? 1 : 0,
    },

    data: data,
  })
  landingOptions.value = (landingResult?.data || []).map((element: any) =>
    Object.assign({}, element, {
      value: element.value,
      label: `${element.value} - ${element.label}`,
    })
  )
}

const fetchLandingPageByDemand = async (
  opts: { q: string; notfound?: boolean } = { q: '' }
) => {
  isLoading.value = true

  ajax(opts)

  isLoading.value = false
}

const isShow = computed<boolean>(() => {
  if (props.data.campaign.IsTrafficSmartNews()) return true
  if (props.data.campaign.IsDemandPubPower()) return true

  if (props.data.campaign.IsCreativeLandingByCreative()) return false
  if (
    props.data.campaign.IsPrelandingOff() &&
    !window.arb.isLead() &&
    !window.arb.isAdmin()
  ) {
    return false
  }
  if (props.data.campaign.IsDemandBing1()) return false

  if (props.data.campaign.IsTrafficGoogle()) {
    if (props.data.campaign.IsOnSearch2Search()) return false
  }
  return props.data.campaign.demand_source ? true : false
})

// onMounted(() => {
//   if (isShow.value) {
//     fetchLandingPageByDemand({
//       q: '',
//       notfound: true,
//     })
//   }
// })

//Change demand source -> fetch lại landing page và xóa landing đang chọn
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (props.data.FreezeData.isEditPage()) {
      return
    }
    if (newValue && props.data.statusData.IsTabCampaign()) {
      fetchLandingPageByDemand()
    } else {
      props.data.campaign.landing_pages = {}
    }
  }
)

watch(
  () => props.data.statusData.IsTabCampaign(),
  (v) => {
    // if (FreezeData.isEditPage()) {
    //   return
    // }
    if (v && isShow.value) {
      fetchLandingPageByDemand()
    }
  },
  { deep: true }
)

const updateLandingPage = (value: number) => {
  if (!props.data.campaign.landing_pages) props.data.campaign.landing_pages = {}

  props.data.campaign.landing_pages.id = value

  if (props.data.campaign.landing_page_ai) {
    props.data.campaign.landing_page_ai = undefined
  }
}

const name = 'Landing Page'

const isComp = window.arb.isCompany()
</script>

<template>
  <div v-if="isShow && props.data.campaign.landing_pages">
    <FloatingWrapper :name="name" rounded required>
      <div class="flex-1 min-w-0 flex flex-col gap-3">
        <div
          class="flex items-center gap-2"
          v-if="
            props.data.FreezeData.isAddorDuplicate() ||
            (props.data.FreezeData.isEditPage() &&
              props.data.campaign.landing_pages.id)
          "
        >
          <n-select
            v-model:value="props.data.campaign.landing_pages.id"
            filterable
            remote
            clearable
            :loading="isLoading"
            :placeholder="name"
            :render-label="renderLandingLabel"
            :options="landingOptions"
            :disabled="isDisabled"
            :on-blur="blurHandle"
            @search="handleLandingSearch"
            :on-update:value="updateLandingPage"
          />

          <n-button
            v-if="
              slugLanding &&
              props.data.campaign.IsDemandAdsense() &&
              isComp &&
              props.data.FreezeData.isEditPage()
            "
            color="#f43f5e"
            type="default"
            :loading="isGetPreview"
            @click="previewAd"
          >
            Preview
          </n-button>

          <n-button
            v-if="slugLanding && props.data.FreezeData.isEditPage()"
            color="#f43f5e"
            type="default"
            @click="editLandingPage"
          >
            Edit
          </n-button>
        </div>
        <div
          v-if="
            props.data.FreezeData.isEditPage() &&
            !props.data.campaign.landing_pages.id &&
            isComp
          "
          class="h-[34px] flex items-center text-xs text-gray-500"
        >
          The landing page is being generated by the AI system and will be ready
          shortly.
        </div>
      </div>
    </FloatingWrapper>
  </div>
</template>
