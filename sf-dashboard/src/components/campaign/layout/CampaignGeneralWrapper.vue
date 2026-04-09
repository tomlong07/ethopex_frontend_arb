<script lang="ts" setup>
import { useFeSettings } from '@/composables/feSettings'
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/CampaignSkeleton.vue'
import ActionButtonsV2 from '../modules/ActionButtonsV2.vue'
import { addDemoData } from '../composables/campaign'
import DemandSource from '../modules/DemandSource.vue'
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import OpenAdFullInfo from '../modules/facebook/OpenAdFullInfo.vue'
import NavBarCampaign from './NavBarCampaign.vue'
import AddDevInfo from '../AddDevInfo.vue'
const CopyCampaignModal = defineAsyncComponent(
  () => import('@/components/campaign/modal/CopyCampaignModal.vue')
)
const menuCampaignStore = useMenuCampaignStore()
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
  demandComp: {
    type: Object as PropType<InstanceType<typeof DemandSource> | null>,
    required: false,
  },
})
const emits = defineEmits(['submit'])
const feSettings = toRef(props.statusData, 'feSettings')
useFeSettings(feSettings, window.route?.meta?.url as string)

const addDevData = async (campaignDev: campaignTypeClass) => {
  await addDemoData(
    toRef(props, 'campaign'),
    toRef(props, 'statusData'),
    campaignDev
  )
  menuCampaignStore.handleShowActionButton()
}

const isDev = computed(() => {
  return window.arb.isDev()
})

const submitForm = async () => {
  emits('submit')
}

const trafficSource = computed(() => props.campaign.traffic_source)
</script>
<template>
  <div class="wrapper flex flex-col bg-base pr-3 flex-1 main_head">
    <CampaignDraftConfirm :campaign="campaign" :statusData="statusData" />

    <div class="h-screen flex flex-col bg-base mt-4 flex-1 gap-4 mb-4">
      <Skeleton v-if="statusData.isLoading" />
      <div class="flex gap-4" v-else>
        <div class="flex w-[74px] lg:w-[340px] flex-none relative">
          <NavBarCampaign
            :campaign="campaign"
            :statusData="statusData"
            :FreezeData="FreezeData"
          />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-3">
            <BackPage
              :url="feSettings.page_list"
              name="Campaign"
              v-if="feSettings.page_list"
            />
            <div class="flex gap-3 items-center">
              <OpenAdFullInfo
                :campaign="campaign"
                :FreezeData="FreezeData"
                v-if="
                  FreezeData.isEditPage() && props.campaign.IsTrafficFacebook()
                "
              />

              <AddDevInfo
                v-if="isDev && FreezeData.isAddPage()"
                :traffic_source="String(trafficSource)"
                :statusData="statusData"
                @addDevData="addDevData"
              />
            </div>
          </div>
          <div class="w-full">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <CopyCampaignModal v-if="FreezeData.isEditPage()" />

    <ActionButtonsV2
      v-if="!statusData.isLoading"
      :campaign="campaign"
      :FreezeData="FreezeData"
      :statusData="statusData"
      @submitForm="submitForm"
    />
  </div>
</template>
