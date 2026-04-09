<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import api_v2 from '@/core/api_v2'
import { DS, ONOFF } from '@/enum/campaign'
import { ctr_campaign } from '@/services/ctr_campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
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
  if (props.campaign.IsTrafficARBTraffic()) {
    return props.FreezeData.isEditPage()
  }
  if (props.campaign.category_site_builder === ONOFF.ON) {
    if (props.campaign.IsTrafficPocPoc() && props.campaign.IsManual()) {
      //Pocpoc manual dùng đc cả 2
    } else {
      return true
    }
  }
  if (props.campaign.IsCloneCampaign()) return true

  if (props.campaign.IsCreativeLandingByCreative()) return true

  return (
    props.FreezeData.isClonePage(props.campaign) ||
    !props.campaign.account_supply_id ||
    !props.campaign.demand_source ||
    // (props.FreezeData.isEditPage() && props.campaign.IsDirectOn())
    props.FreezeData.isEditPage() //Khánh bảo thế //tất cả trường hợp
  )
})

const slugLanding = computed<string>(() => {
  if (!props.campaign.landing_pages?.id) {
    return ''
  }
  for (let index = 0; index < landingOptions.value.length; index++) {
    if (landingOptions.value[index].value == props.campaign.landing_pages.id) {
      return (landingOptions.value[index].slug as string) || ''
    }
  }

  return ''
})

const isGetPreview = ref<boolean>(false)

const landingPreviewInput = computed(() => {
  return {
    landing_page_id: props.campaign.landing_pages?.id,
    traffic_source: props.campaign.traffic_source,
    user_flow: props.campaign.user_flow,
    vertical: props.campaign.vertical,
  }
})

const previewAd = async () => {
  isGetPreview.value = true
  const result = await ctr_campaign.GetPreview(landingPreviewInput.value)
  isGetPreview.value = false

  if (result?.status && result?.data) {
    window.open(
      result?.data + ` &arb_campaign_id=${props.campaign.id}`,
      '_blank'
    )
    return
  }
  window.message.error(
    `Failed to fetch account by demand: ${result?.errors[0].message}`
  )
}

const editLandingPage = () => {
  if (!props.campaign.landing_pages?.id) {
    return
  }

  window.open(`/landing_page/${props.campaign.landing_pages?.id}`, '_blank')
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
    filter: { demand_source: props.campaign.demand_source } as Record<
      string,
      any
    >,
  }

  if (props.campaign.prelanding === ONOFF.ON) {
    data.filter.prelander = 'off'
  }
  const landingResult = await api_v2.request({
    url: 'filter/landing-page',
    params: {
      q: opts.q,
      f: props.campaign.landing_pages?.id
        ? String(props.campaign.landing_pages?.id)
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
  if (props.campaign.IsTrafficSmartNews()) return true
  if (props.campaign.IsTrafficPinterest() && props.campaign.IsManual()) {
    return true
  }
  if (
    props.campaign.IsTrafficARBTraffic() &&
    props.campaign.category_site_builder !== ONOFF.ON
  )
    return true
  if (props.campaign.IsDemandPubPower()) return true

  if (props.campaign.IsCreativeLandingByCreative()) return false
  if (
    props.campaign.IsPrelandingOff() &&
    !window.arb.isLead() &&
    !window.arb.isAdmin() &&
    !props.statusData.permission.landing_by_creative
  ) {
    return false
  }

  if (props.campaign.IsTrafficGoogle()) {
    if (props.campaign.IsOnSearch2Search()) return false
  }

  if (!props.campaign.IsInternalLanding()) {
    return true
  }
  return props.campaign.demand_source ? true : false
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
    if (props.FreezeData.isEditPage()) {
      return
    }
    if (newValue && props.statusData.IsTabCampaign()) {
      fetchLandingPageByDemand()
    } else {
      props.campaign.landing_pages = {}
    }
  }
)

watch(
  () => props.statusData.IsTabCampaign(),
  (v) => {
    // if (props.FreezeData.isEditPage()) {
    //   return
    // }
    if (v && isShow.value) {
      fetchLandingPageByDemand()
    }
  },
  { deep: true }
)

const updateLandingPage = (value: number) => {
  if (!props.campaign.landing_pages) props.campaign.landing_pages = {}

  props.campaign.landing_pages.id = value

  if (props.campaign.landing_page_ai) {
    props.campaign.landing_page_ai = undefined
  }
}

const name = 'Landing Page'

const isComp = window.arb.isCompany()
</script>

<template>
  <div
    v-if="
      isShow &&
      props.campaign.landing_pages &&
      (props.FreezeData.isAddorDuplicate() ||
        (FreezeData.isEditPage() && props.campaign.landing_pages?.id))
    "
  >
    <FloatingWrapper :name="name" rounded required>
      <div class="flex-1 min-w-0 flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <n-select
            v-model:value="props.campaign.landing_pages.id"
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
              props.campaign.IsDemandAdsense() &&
              isComp &&
              props.FreezeData.isEditPage()
            "
            color="#f43f5e"
            type="default"
            :loading="isGetPreview"
            @click="previewAd"
          >
            Preview
          </n-button>

          <n-button
            v-if="slugLanding && props.FreezeData.isEditPage()"
            color="#f43f5e"
            type="default"
            @click="editLandingPage"
          >
            Edit
          </n-button>
        </div>
      </div>
    </FloatingWrapper>
  </div>
</template>
