<script setup lang="ts">
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import ButtonActionV2 from './ButtonActionV2.vue'
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
})

const emit = defineEmits<{
  (e: 'submitForm'): void
}>()

const submitForm = () => {
  emit('submitForm')
}

const isFirstKey = computed(() => {
  if (props.campaign.IsManual()) {
    return false
  }
  return props.statusData.IsFirstKey() ?? false
})

const isLastKey = computed(() => {
  return props.statusData.IsLastKey() ?? false
})

const isHiddenButton = computed(() => {
  // if (isLastKey.value) {
  //   return true
  // }
  return (
    (props.statusData.IsShowActionButton() || props.campaign.IsManual()) ??
    false
  )
})
const displayButtonNext = computed(() => {
  if (
    props.campaign.IsTrafficFacebook() ||
    props.campaign.IsTrafficGoogle() ||
    props.campaign.IsTrafficTiktok() ||
    props.campaign.IsTrafficNewsbreak() ||
    props.campaign.IsTrafficTaboola() ||
    props.campaign.IsTrafficSnapchat()
  ) {
    return true
  }
  return false
})
const displayButtonSubmit = computed(() => {
  if (
    props.campaign.IsManual() ||
    props.campaign.IsTrafficFacebook() ||
    props.campaign.IsTrafficGoogle() ||
    props.campaign.IsTrafficTiktok() ||
    props.campaign.IsTrafficNewsbreak() ||
    props.campaign.IsTrafficTaboola() ||
    props.campaign.IsTrafficSnapchat()
  ) {
    return true
  }
  return false
})
</script>

<template>
  <div
    class="flex flex-row-reverse sticky bottom-0 p-2 z-20 ml-[74px] lg:ml-[340px] bg-white"
  >
    <div class="flex gap-2 justify-end w-full">
      <div class="flex gap-2" v-if="displayButtonNext">
        <n-button
          v-if="isLastKey"
          size="medium"
          @click="menuCampaignStore.prevTab"
        >
          Back
        </n-button>
        <n-button
          v-if="isFirstKey"
          size="medium"
          type="success"
          @click="menuCampaignStore.nextTab"
        >
          Next
        </n-button>
      </div>
      <div
        class="flex items-center"
        :class="{
          'gap-2': props.FreezeData.isEditPage() && !props.statusData.isLoading,
        }"
      >
        <div class="flex items-center gap-2">
          <ButtonActionV2
            :campaign="props.campaign"
            :statusData="props.statusData"
            v-if="props.FreezeData.isEditPage() && !props.statusData.isLoading"
          />
        </div>
        <div v-if="displayButtonSubmit">
          <n-button
            v-if="isHiddenButton"
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="
              props.statusData.isLoading || props.statusData.disabledSubmit
            "
            :loading="props.statusData.isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>

        <div v-else>
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="
              props.statusData.isLoading || props.statusData.disabledSubmit
            "
            :loading="props.statusData.isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
