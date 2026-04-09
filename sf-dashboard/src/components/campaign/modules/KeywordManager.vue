<script setup lang="ts">
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'
import TrashOutline from '@/assets/icons/TrashOutline.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import api_v2 from '@/core/api_v2'
import { ONOFF } from '@/enum/campaign'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { NIcon, SelectOption } from 'naive-ui'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const loadingDomains = ref(false)
const loadingLandingPage = ref(false)
const landingOptions = ref<SelectOption[]>([])
const domainOptions = ref<SelectOption[]>([])

const keywordManager = computed(() => {
  return props.campaign.keyword_manager
})

const keywords = computed(() => {
  return keywordManager.value?.keywords_campaign ?? []
})

if (!props.campaign.keyword_manager) {
  props.campaign.keyword_manager = {
    domain: '',
    keywords_campaign: []
  }
}

// Nếu chưa có data, tạo 1 item mặc định
if (!props.campaign.keyword_manager.keywords_campaign?.length) {
  props.campaign.keyword_manager.keywords_campaign = [{
    keyword: '',
    landing_page_id: null,
    keyword_prelander: '',
    domain_prelander: null,
    status_prelander: ONOFF.ON,
  }]
}

const updateHandleStatusChange = (
  index: number,
  value: ONOFF
) => {
  const keywordCampaign = keywords.value[index]
  keywordCampaign.status_prelander = value as ONOFF
  if (value === ONOFF.ON && domainOptions.value.length) {
    keywordCampaign.domain_prelander = domainOptions.value[0].value as string
  }
}

const addKeyword = () => {
  keywords.value.push({
    keyword: '',
    landing_page_id: null,
    keyword_prelander: '',
    domain_prelander: null,
    status_prelander: ONOFF.ON,
  })
}

const removeKeywords = (index: number) => {
  if (keywords.value.length > 1) {
    keywords.value.splice(index, 1)
  }
}

const handleSearch = debounceV2(async (q: string = '') => {
  fetchLandingPage(q)
}, 1000)

const handleSearchDomain = debounceV2(async (q: string = '') => {
  fetchDomains(q)
}, 1000)

const fetchLandingPage = async (q = '') => {
  try {
    loadingLandingPage.value = true
    let data = {
      filter: { demand_source: props.campaign.demand_source } as Record<
        string,
        any
      >,
    }
    
    const selectedIds = props.campaign.keyword_manager?.keywords_campaign
      ?.map(k => k.landing_page_id)
      .filter(id => id !== null && id !== undefined) || []
    
    const response = await api_v2.request({
      url: 'filter/landing-page',
      params: {
        q: q,
        f: selectedIds.length > 0 
          ? selectedIds.join(',')
          : (props.campaign.landing_pages?.id 
            ? String(props.campaign.landing_pages?.id)
            : undefined),
      },
      data: data
    })
    
    const newOptions = (response?.data || []).map((element: any) =>
      Object.assign({}, element, {
        value: element.value,
        label: `${element.value} - ${element.label}`,
      })
    )
    
    const existingValues = landingOptions.value.map(opt => opt.value)
    const uniqueNewOptions = newOptions.filter(
      (opt: any) => !existingValues.includes(opt.value)
    )
    
    if (q === '') {
      landingOptions.value = newOptions
    } else {
      landingOptions.value = [...landingOptions.value, ...uniqueNewOptions]
    }
  } catch (error) {
    console.error('Error fetching landing page:', error)
  } finally {
    loadingLandingPage.value = false
  }
}

const fetchDomains = async (q = '') => {
  try {
    loadingLandingPage.value = true
    const response = await ctr_filter_v2.FilterDomain({
      q,
      f: '',
      type: 'prelanding',
    })
    const domains: SelectOption[] = response?.data || []
    const existingValues = domainOptions.value.map((option) => option.value)
    const newOptions = domains.filter(
      (domains) => !existingValues.includes(domains.value)
    )
    if (q === '') {
      domainOptions.value = domains
    } else {
      domainOptions.value = [...domainOptions.value, ...newOptions]
    }
  } catch (error) {
    console.error('Error fetching domains:', error)
  } finally {
    loadingLandingPage.value = false
  }
}

const handleEditModeData = () => {
  props.campaign.keyword_manager?.keywords_campaign?.forEach(
    (keywordCampaign) => {
      if (keywordCampaign.status_prelander === 'off') {
        keywordCampaign.domain_prelander = null
        keywordCampaign.keyword_prelander = ''
      }
    }
  )
}

onMounted(() => {
  props.campaign.keyword_manager?.keywords_campaign?.forEach(
    (keywordCampaign) => {
      if (keywordCampaign.domain_prelander === '') {
        keywordCampaign.domain_prelander = null
      }
    }
  )
  
  fetchLandingPage()
  fetchDomains()
  handleEditModeData()
})

const renderOptionLabel = (option: any) => {
  let iconComponent: Component | null = null
  let iconClass = ''

  switch (option.keyword_status) {
    case 'success':
      iconComponent = Checkmark
      iconClass = 'text-green-500'
      break
    case 'error':
      iconComponent = Close
      iconClass = 'text-red-500'
      break
    case 'pending':
      iconComponent = ReportGmailerrorredFilled
      iconClass = 'text-yellow-500'
      break
  }

  return h(
    'div',
    {
      class: 'flex items-center justify-between w-full gap-2',
    },
    [
      h('span', { class: 'flex-1 truncate' }, option.label),
      iconComponent
        ? h(
            NIcon,
            {
              class: `${iconClass} flex-shrink-0 w-4 h-4`,
              size: 16,
            },
            { default: () => h(iconComponent!) }
          )
        : null,
    ]
  )
}

const openLandingPage = (landingId: number | null) => {
  if (!landingId) return
  window.open(`/landing_page/${landingId}`, '_blank')
}
</script>

<template>
  <div class="form-group">
    <label class="text-xs font-medium text-gray-700 flex-shrink-0 pt-2">
      Targeting
    </label>
    <div class="flex-1">
      <div class="space-y-3">
        <div
          v-for="(keyword, index) in keywords"
          :key="index"
          class="flex gap-3 items-center py-2"
        >
          <div class="flex justify-center">
            <CustomSwitch
              v-model="keywords[index].status_prelander"
              type="onoff"
              true-label="On"
              false-label="Off"
              size="small"
              @update:modelValue="(value: any) => updateHandleStatusChange(index, value as ONOFF)"
            />
          </div>

          <div class="flex-1">
            <FloatingWrapper name="Domain Prelander">
              <n-select
                v-model:value="keywords[index].domain_prelander"
                :options="domainOptions"
                placeholder=""
                size="medium"
                class="w-full"
                filterable
                clearable
                :loading="loadingDomains && keyword.status_prelander === 'on'"
                :consistent-menu-width="false"
                :disabled="keyword.status_prelander === 'off' || !keyword.status_prelander"
                @search="handleSearchDomain()"
              />
            </FloatingWrapper>
          </div>

          <div class="flex-1">
            <FloatingWrapper name="Keyword Prelander">
              <n-input
                v-model:value="keywords[index].keyword_prelander"
                placeholder="Enter keyword prelander"
                size="medium"
                :disabled="keyword.status_prelander === 'off' || !keyword.status_prelander"
              />
            </FloatingWrapper>
          </div>

          <div class="flex-1 flex items-center gap-2">
            <FloatingWrapper name="Landing Page">
              <n-select
                v-model:value="keywords[index].landing_page_id"
                :options="landingOptions"
                placeholder="AI-Generated Default Landing Page"
                size="medium"
                class="w-full"
                filterable
                clearable
                :loading="loadingLandingPage"
                :consistent-menu-width="false"
                @search="handleSearch"
                :render-label="renderOptionLabel"
              />
            </FloatingWrapper>

            <n-button text @click="openLandingPage(keyword.landing_page_id)">
              <n-icon :component="EyeOutline" />
            </n-button>
          </div>

          <div class="flex-1">
            <FloatingWrapper name="Keyword Widget">
              <n-input
                v-model:value="keywords[index].keyword"
                placeholder=""
                size="medium"
                maxlength="30"
                show-count
              />
            </FloatingWrapper>
          </div>

          <div class="w-10 flex justify-center">
            <n-button
              @click="removeKeywords(index)"
              size="medium"
              type="error"
              quaternary
              circle
            >
              <template #icon>
                <n-icon><TrashOutline /></n-icon>
              </template>
            </n-button>
          </div>
        </div>

        <div class="flex justify-start px-4 pt-2 pl-0">
          <n-button icon-placement="left" @click="addKeyword()" class="w-fit">
            <template #icon>
              <n-icon>
                <PlusSmall />
              </n-icon>
            </template>
            Add Keyword
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>