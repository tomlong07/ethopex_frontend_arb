<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
// import DeliveryStatus from '../DeliveryStatus.vue'

import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

import { renderIcon } from '@/utils/utils'
import useAdDataStore from '@/store/adDataStore'
import { ctr_campaign } from '@/services/ctr_campaign'
import ToggleOff from '@/assets/icons/ToggleOff.vue'
import ToggleOn from '@/assets/icons/ToggleOn.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import { TType } from '@/enum/naiveui'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})

const isLoadingStatus = ref<boolean[]>([])

const adDataStore = useAdDataStore()

const openModalAd = (ad: any) => {
  adDataStore.adInfo = ad
  adDataStore.campaignId = props.campaign.id
  adDataStore.showModal = true
}

const adCreatives = computed(() => {
  return props.campaign?.ad_groups?.[props.index]?.ad_creative || []
})

const getAdsOptions = () => {
  const isDisabled = false

  return [
    {
      label: 'View Ads',
      key: 'view',
      icon: renderIcon(EyeOutline),
      disabled: isDisabled,
    },
  ]
}

const adsOptions = computed(() => getAdsOptions())

const handleSelect = async (key: string, ad: any, ind: number) => {
  if (key === 'view') {
    openModalAd(ad)
    return
  }
  if (adCreatives) {
    isLoadingStatus.value[ind] = true
    try {
      const result = await ctr_campaign.ChangeStatusAds({
        campaign_id: props.campaign.id,
        creative_submit_id: ad.id,
        status: key,
      })
      isLoadingStatus.value[ind] = false

      if (result.status) {
        window.message.success(`Status changed successfully`)
        adCreatives.value[ind].status = key
      }
    } catch (error) {
      console.error('Error changing ad creative status:', error)
      window.message.error(`Error changing ad creative status!`)
      isLoadingStatus.value[ind] = false
    }
  }
}

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedCreatives = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return adCreatives.value.slice(start, end)
})

const handlePageSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const typeNow = (status: string = '') => {
  return (helper.classRender(status) as TType) || undefined
}

const isComp = computed(() => {
  return window.arb.isCompany()
})

// Helper functions for layout 2 style
const colorNow = (status: string = '') => {
  // Return border color class based on status
  if (status === 'approved') return 'border-green-300'
  if (status === 'rejected') return 'border-red-300'
  return 'border-gray-300'
}

const getDeliveryStatusTooltip = (ad: any) => {
  // Return delivery status tooltip text
  return (
    ad.delivery_status_tooltip ||
    ad.delivery_status ||
    'No delivery information'
  )
}
</script>

<template>
  <n-card
    :title="`Ad Creative Detail (${adCreatives.length})`"
    v-if="adCreatives.length"
    class="rounded-[5px] !border-gray2"
  >
    <div class="space-y-4">
      <!-- Card Grid Layout (Layout 2 style) -->
      <div class="flex flex-wrap gap-4">
        <div
          class="relative flex flex-col w-72 flex-shrink-0"
          v-for="(creative, creativeIndex) in paginatedCreatives"
          :key="creativeIndex"
        >
          <!-- Header -->
          <div
            :class="[
              'flex flex-col gap-2 p-3 shadow-sm min-h-20 flex-shrink-0 w-full rounded-t',
              creative.error
                ? 'bg-red-100 border border-red-400 text-red-500'
                : 'bg-green-100 border border-green-400 text-green-700',
            ]"
          >
            <div class="flex items-start gap-2">
              <div class="flex items-center gap-2">
                <n-dropdown
                  trigger="hover"
                  :options="adsOptions"
                  @select="(key: string) => handleSelect(key, creative, creativeIndex)"
                  placement="bottom-start"
                  :keyboard="false"
                >
                  <n-button quaternary circle size="small">
                    <template #icon>
                      <n-icon size="20" :component="Settings20Regular" />
                    </template>
                  </n-button>
                </n-dropdown>
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="cursor-pointer leading-4 text-sm font-medium overflow-hidden"
                >
                  <div class="break-words">
                    {{
                      `${creative.ad_id ? creative.ad_id + ' - ' : ''}${
                        creative.name
                      }`
                    }}
                  </div>
                </div>
              </div>

              <div
                class="w-6 h-6 flex justify-center items-center flex-shrink-0"
              >
                <n-tooltip v-if="creative.error" placement="top">
                  <template #trigger>
                    <n-icon size="18" class="cursor-pointer">
                      <InformationCircleOutline />
                    </n-icon>
                  </template>
                  <div
                    style="
                      max-width: 250px;
                      white-space: pre-line;
                      word-break: break-word;
                    "
                  >
                    {{ creative.error }}
                  </div>
                </n-tooltip>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div
            class="flex flex-col gap-3 p-3 bg-white border-x border-b shadow-sm min-h-36 flex-shrink-0 w-full rounded-b"
            :class="creative.error ? 'border-red-400' : 'border-green-500'"
          >
            <!-- AI Status -->
            <div class="flex items-center justify-between h-8">
              <CampaingModuleAIStatus :ad="creative" />
            </div>

            <!-- Divider -->
            <div class="border-t" :class="colorNow(creative.ai_status)"></div>

            <!-- Status Toggle -->
            <div class="flex items-center justify-between h-8">
              <span class="text-sm font-medium text-gray-800">Status:</span>
              <div class="flex items-center justify-center">
                <n-spin v-if="isLoadingStatus[creativeIndex]" size="small" />
                <n-icon
                  v-else
                  size="28"
                  class="cursor-pointer transition-colors duration-200 hover:opacity-80"
                  :component="creative.status === 'on' ? ToggleOn : ToggleOff"
                  :class="
                    creative.status === 'on'
                      ? 'text-green-500'
                      : 'text-gray-400'
                  "
                  @click="
                    handleSelect(
                      creative.status === 'on' ? 'off' : 'on',
                      creative,
                      creativeIndex
                    )
                  "
                />
              </div>
            </div>

            <!-- Divider -->
            <div
              class="border-t"
              :class="creative.error ? 'border-red-300' : 'border-green-300'"
            ></div>

            <!-- Delivery Status -->
            <div class="flex items-center justify-between h-8">
              <span class="text-sm font-medium text-gray-800"> Delivery: </span>
              <div class="flex items-center">
                <n-tooltip placement="top">
                  <template #trigger>
                    <n-tag :type="typeNow(creative.delivery_status)">
                      {{ (creative.delivery_status || 'N/A').toUpperCase() }}
                    </n-tag>
                  </template>
                  <div
                    style="
                      max-width: 250px;
                      white-space: pre-line;
                      word-break: break-word;
                    "
                  >
                    {{ getDeliveryStatusTooltip(creative) }}
                  </div>
                </n-tooltip>
              </div>
            </div>

            <template v-if="isComp">
              <div
                class="border-t"
                :class="creative.error ? 'border-red-300' : 'border-green-300'"
              ></div>

              <div class="flex items-center justify-between h-8">
                <span class="text-sm font-medium text-gray-800">
                  Keyword Status:
                </span>
                <div class="flex items-center">
                  <n-tag :type="typeNow(creative.status_link)">
                    {{ (creative.status_link || 'N/A').toUpperCase() }}
                  </n-tag>
                </div>
              </div>
            </template>

            <!-- URL (if exists) -->
            <template v-if="creative?.url">
              <!-- Divider -->
              <div
                class="border-t"
                :class="creative.error ? 'border-red-300' : 'border-green-300'"
              ></div>

              <div class="flex flex-col gap-1">
                <span class="text-sm font-medium text-gray-800">URL:</span>
                <a
                  :href="creative?.url"
                  target="_blank"
                  class="text-blue-600 hover:underline text-sm truncate"
                  :title="creative?.url"
                >
                  {{ creative?.url }}
                </a>
              </div>
            </template>
          </div>
        </div>
      </div>

      <n-pagination
        v-model:page="currentPage"
        :page-size="pageSize"
        :item-count="adCreatives.length"
        show-size-picker
        :page-sizes="[5, 10, 20, 50]"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </n-card>
</template>
