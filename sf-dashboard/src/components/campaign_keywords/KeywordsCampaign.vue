<script setup lang="ts">
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'
import TrashOutline from '@/assets/icons/TrashOutline.vue'
import { ONOFF } from '@/enum/campaign'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { campaignKeywordsManagerStore } from '@/store/details/campaignKeywordsManagerStore'
import { KeywordCampaign } from '@/types/components/campaignkeywords'
import { debounceV2 } from '@/utils'
import { NIcon, SelectOption } from 'naive-ui'
import CustomSwitch from '../common/CustomSwitch.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const campaignKeywordsStore = campaignKeywordsManagerStore()
const loadingCampaigns = ref(false)
const loadingDomains = ref(false)
const campaignOptions = ref<SelectOption[]>([])
const domainOptions = ref<SelectOption[]>([])

const updateHandleStatusChange = (
  keywordCampaign: KeywordCampaign,
  value: ONOFF
) => {
  keywordCampaign.status_prelander =
    value as typeof keywordCampaign.status_prelander
  if (value === ONOFF.ON && domainOptions.value.length) {
    keywordCampaign.domain_prelander = domainOptions.value[0].value as string
  }
}

const addKeyword = () => {
  campaignKeywordsStore.campaignKeyword.keyword_campaigns.push({
    keyword: '',
    campaign: null,
    keyword_prelander: '',
    domain_prelander: null,
    status_prelander: ONOFF.ON,
  })
}

const removeKeywords = (index: number) => {
  if (campaignKeywordsStore.campaignKeyword.keyword_campaigns.length > 1) {
    campaignKeywordsStore.campaignKeyword.keyword_campaigns.splice(index, 1)
  }
}

// const handleStatusChange = (index: number, value: string) => {
//   const keywordCampaign =
//     campaignKeywordsStore.campaignKeyword.keyword_campaigns[index]

//   if (value) {
//     keywordCampaign.domain_prelander = null
//     keywordCampaign.keyword_prelander = ''
//   }
// }
const handleSearch = debounceV2(async (q: string = '') => {
  fetchCampaigns(q)
}, 1000)

const handleSearchDomain = debounceV2(async (q: string = '') => {
  fetchDomains(q)
}, 1000)
const fetchCampaigns = async (q = '') => {
  try {
    loadingCampaigns.value = true
    const response = await ctr_filter_v2.FilterCampaign({
      traffic_source: 'pocpoc',
      q,
      f: campaignKeywordsStore.selectedCampaignIds?.join(','),
    })
    const campaigns: SelectOption[] = response?.data || []
    const existingValues = campaignOptions.value.map((option) => option.value)
    const newOptions = campaigns.filter(
      (campaign) => !existingValues.includes(campaign.value)
    )
    if (q === '') {
      campaignOptions.value = campaigns
    } else {
      campaignOptions.value = [...campaignOptions.value, ...newOptions]
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error)
  } finally {
    loadingCampaigns.value = false
  }
}
const fetchDomains = async (q = '') => {
  try {
    loadingDomains.value = true
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
    loadingDomains.value = false
  }
}
const handleEditModeData = () => {
  campaignKeywordsStore.campaignKeyword.keyword_campaigns.forEach(
    (keywordCampaign, index) => {
      if (keywordCampaign.status_prelander === 'off') {
        keywordCampaign.domain_prelander = null
        keywordCampaign.keyword_prelander = ''
      }
    }
  )
}

onMounted(() => {
  campaignKeywordsStore.campaignKeyword.keyword_campaigns.forEach(
    (keywordCampaign) => {
      if (keywordCampaign.domain_prelander === '') {
        keywordCampaign.domain_prelander = null
      }
    }
  )
  fetchCampaigns()
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

const openCampaign = (campaignId: number | null) => {
  if (!campaignId) return
  window.open(`/campaign/google/${campaignId}`, '_blank')
}
</script>

<template>
  <div class="form-group">
    <label class="text-xs font-medium text-gray-700 flex-shrink-0 pt-2">
      Targeting
    </label>
    <div class="flex-1">
      <!-- <div
        class="flex gap-3 items-center px-4 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-t-md"
      >
        <div class="w-[120px] text-center text-xs">Status</div>
        <div class="flex-1 text-xs">Domain Prelander</div>
        <div class="flex-1 text-xs">Keyword Prelander</div>
        <div class="flex-1 text-xs">Campaign</div>
        <div class="flex-1 text-xs">Keyword Widget</div>
        <div class="w-10"></div>
      </div> -->

      <div class="space-y-3">
        <div
          v-for="(keyword_campaigns, keyWordsIndex) in campaignKeywordsStore
            .campaignKeyword.keyword_campaigns"
          :key="keyWordsIndex"
          class="flex gap-3 items-center py-2 "
        >
          <div class="flex justify-center">
            <CustomSwitch
              v-model="keyword_campaigns.status_prelander"
              type="onoff"
              true-label="On"
              false-label="Off"
              size="small"
              @update:modelValue="(value) => updateHandleStatusChange(keyword_campaigns, value as ONOFF)"
            />
          </div>

          <div class="flex-1">
            <FloatingWrapper
              name="Domain Prelander"
            >
              <n-select
                v-model:value="keyword_campaigns.domain_prelander"
                :options="domainOptions"
                placeholder=""
                size="medium"
                class="w-full"
                filterable
                clearable
                :loading="
                  loadingDomains && keyword_campaigns.status_prelander === 'on'
                "
                :consistent-menu-width="false"
                :disabled="
                  keyword_campaigns.status_prelander === 'off' ||
                  !keyword_campaigns.status_prelander
                "
                @search="handleSearchDomain()"
              />
            </FloatingWrapper>
          </div>

          <div class="flex-1">
            <FloatingWrapper
              name="Keyword Prelander"
            >
              <n-input
                v-model:value="keyword_campaigns.keyword_prelander"
                placeholder="Enter keyword prelander"
                size="medium"
                :disabled="
                  keyword_campaigns.status_prelander === 'off' ||
                  !keyword_campaigns.status_prelander
                "
              />
            </FloatingWrapper>
          </div>

          <div class="flex-1 flex items-center gap-2">
            <FloatingWrapper
              name="Campaign"
            >
              <n-select
                v-model:value="keyword_campaigns.campaign"
                :options="campaignOptions"
                placeholder=""
                size="medium"
                class="w-full"
                filterable
                clearable
                :loading="loadingCampaigns"
                :consistent-menu-width="false"
                @search="handleSearch"
                :render-label="renderOptionLabel"
              />
            </FloatingWrapper>

            <n-button text @click="openCampaign(keyword_campaigns.campaign)"
              ><n-icon :component="EyeOutline"
            /></n-button>
          </div>

          <div class="flex-1">
            <FloatingWrapper
              name="Keyword Widget"
            >
              <n-input
                v-model:value="keyword_campaigns.keyword"
                placeholder=""
                size="medium"
                maxlength="30"
                show-count
              />
            </FloatingWrapper>
          </div>

          <div class="w-10 flex justify-center">
            <n-button
              @click="removeKeywords(keyWordsIndex)"
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
