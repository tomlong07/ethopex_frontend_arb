<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import { renderIcon } from '@/utils/utils'
import { DropdownOption } from 'naive-ui'

import { ctr_campaign } from '@/services/ctr_campaign'
import useCampaign2Store from '@/store/useCampaign2Store'
import ToggleOn from '@/assets/icons/ToggleOn.vue'
import ToggleOff from '@/assets/icons/ToggleOff.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import { VNodeChild } from 'vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  index: {
    type: Number,
    required: true,
  },
})
const campaign2Store = useCampaign2Store()

const openModalAd = (ad: any) => {
  campaign2Store.adInfo = ad
  campaign2Store.campaign = props.campaign
  campaign2Store.showModalAd = true
}

const getAdsOptions = () => {
  const isDisabled = false

  return [
    {
      label: 'Edit Ads',
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

  if (props.campaign.ad_groups) {
    ad.isLoading = true

    const result = await ctr_campaign.ChangeStatusAds({
      campaign_id: props.campaign.id,
      creative_submit_id: ad.id,
      status: key,
    })

    if (result?.status) {
      if (key === 'remove') {
        window.message.success(`Deleted success!`)

        if (props.campaign.ad_groups[props.index].ad_creative) {
          props.campaign.ad_groups[props.index].ad_creative?.splice(ind, 1)
        }
      } else {
        window.message.success(`Status changed successfully`)

        if (props.campaign.ad_groups[props.index].ad_creative) {
          // @ts-ignore
          props.campaign.ad_groups[props.index].ad_creative[ind].status = key
        }
      }
    }

    ad.isLoading = false
  }
}
const createRenderLabel = (ad: any) => {
  return (option: DropdownOption) => {
    return option.label as VNodeChild
  }
}

const colorNow = (status: string) => {
  switch (status) {
    case 'approved':
      return 'border-green-300'
    case 'rejected':
      return 'border-red-300'
    default:
      break
  }

  return ''
}

const typeNow = (status: string = '') => {
  return helper.classRender(status)
}
const getDeliveryStatusTooltip = computed(() => {
  return (ad: any) => {
    if (!ad.delivery_status_reasons) {
      return 'No reasons provided'
    }

    try {
      const reasons = JSON.parse(ad.delivery_status_reasons)
      return Array.isArray(reasons)
        ? reasons.join(', ')
        : ad.delivery_status_reasons
    } catch {
      return ad.delivery_status_reasons || 'No reasons provided'
    }
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex items-start gap-2"
      v-if="
        props.campaign.ad_groups &&
        props.campaign.ad_groups[props.index].ad_creative?.length
      "
    >
      <div class="w-40 font-bold flex-shrink-0">Ad Detail</div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap gap-4">
          <div
            class="relative flex flex-col w-72 flex-shrink-0"
            v-for="(ad, ind) in props.campaign.ad_groups[props.index]
              .ad_creative"
            :key="ind"
          >
            <!-- Header -->
            <div
              :class="[
                'flex flex-col gap-2 p-3 shadow-sm min-h-20 flex-shrink-0 w-full rounded-t',
                ad.error
                  ? 'bg-red-100 border border-red-400 text-red-500'
                  : 'bg-green-100 border border-green-400 text-green-700',
              ]"
            >
              <div class="flex items-start gap-2">
                <div class="flex-1 min-w-0">
                  <n-dropdown
                    trigger="hover"
                    :options="adsOptions"
                    :render-label="createRenderLabel(ad)"
                    @select="(key: string) => handleSelect(key, ad, ind)"
                  >
                    <div
                      class="cursor-pointer leading-4 text-sm font-medium overflow-hidden"
                    >
                      <div class="break-words">
                        {{ `${ad.ad_id ? ad.ad_id + ' - ' : ''}${ad.name}` }}
                      </div>
                    </div>
                  </n-dropdown>
                </div>

                <div
                  class="w-6 h-6 flex justify-center items-center flex-shrink-0"
                >
                  <n-tooltip v-if="ad.error" placement="top">
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
                      {{ ad.error }}
                    </div>
                  </n-tooltip>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div
              class="flex flex-col gap-3 p-3 bg-white border-x border-b shadow-sm min-h-36 flex-shrink-0 w-full rounded-b"
              :class="ad.error ? 'border-red-400' : 'border-green-500'"
            >
              <!-- AI Status -->
              <div class="flex items-center justify-between h-8">
                <CampaingModuleAIStatus :ad="ad" />
              </div>

              <!-- Divider -->
              <div class="border-t" :class="colorNow(ad.ai_status)"></div>

              <!-- Status Toggle -->
              <div class="flex items-center justify-between h-8">
                <span class="text-sm font-medium text-gray-800">Status:</span>
                <div class="flex items-center justify-center">
                  <n-spin v-if="ad.isLoading" size="small" />
                  <n-icon
                    v-else
                    size="28"
                    class="cursor-pointer transition-colors duration-200 hover:opacity-80"
                    :component="ad.status === 'on' ? ToggleOn : ToggleOff"
                    :class="
                      ad.status === 'on' ? 'text-green-500' : 'text-gray-400'
                    "
                    @click="
                      handleSelect(ad.status === 'on' ? 'off' : 'on', ad, ind)
                    "
                  />
                </div>
              </div>

              <!-- Divider -->
              <div
                class="border-t"
                :class="ad.error ? 'border-red-300' : 'border-green-300'"
              ></div>

              <!-- Delivery Status -->
              <div class="flex items-center justify-between h-8">
                <span class="text-sm font-medium text-gray-800">
                  Delivery:
                </span>
                <div class="flex items-center">
                  <n-tooltip placement="top">
                    <template #trigger>
                      <n-tag :type="typeNow(ad.delivery_status)">
                        {{ (ad.delivery_status || 'N/A').toUpperCase() }}
                      </n-tag>
                    </template>
                    <div
                      style="
                        max-width: 250px;
                        white-space: pre-line;
                        word-break: break-word;
                      "
                    >
                      {{ getDeliveryStatusTooltip(ad) }}
                    </div>
                  </n-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
