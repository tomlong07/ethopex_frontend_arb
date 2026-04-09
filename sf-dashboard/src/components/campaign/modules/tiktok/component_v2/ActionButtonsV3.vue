<script setup lang="ts">
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import { CampaignContext } from '@/types/components/campaign-v2'
import ButtonActionV2 from '../../ButtonActionV2.vue'
const menuCampaignStore = useMenuCampaignStore()

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
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
  if (props.data.campaign.IsManual()) {
    return false
  }
  return props.data.statusData.IsFirstKey() ?? false
})

const isLastKey = computed(() => {
  return props.data.statusData.IsLastKey() ?? false
})

const isHiddenButton = computed(() => {
  // if (isLastKey.value) {
  //   return true
  // }
  return props.data.statusData.IsShowActionButton() ?? false
})
const displayButtonNext = computed(() => {
  if (
    props.data.campaign.IsTrafficFacebook() ||
    props.data.campaign.IsTrafficGoogle() ||
    props.data.campaign.IsTrafficTiktok() ||
    props.data.campaign.IsTrafficNewsbreak() ||
    props.data.campaign.IsTrafficTaboola()
  ) {
    return true
  }
  return false
})
const displayButtonSubmit = computed(() => {
  if (
    props.data.campaign.IsTrafficFacebook() ||
    props.data.campaign.IsTrafficGoogle() ||
    props.data.campaign.IsTrafficTiktok() ||
    props.data.campaign.IsTrafficNewsbreak() ||
    props.data.campaign.IsTrafficTaboola()
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
          'gap-2': data.FreezeData.isEditPage() && !data.statusData.isLoading,
        }"
      >
        <div class="flex items-center gap-2">
          <ButtonActionV2
            :campaign="data.campaign"
            :statusData="data.statusData"
            v-if="data.FreezeData.isEditPage() && !data.statusData.isLoading"
          />
        </div>
        <div v-if="displayButtonSubmit">
          <n-button
            v-if="isHiddenButton"
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="
              data.statusData.isLoading || data.statusData.disabledSubmit
            "
            :loading="data.statusData.isSubmitBtnLoading"
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
              data.statusData.isLoading || data.statusData.disabledSubmit
            "
            :loading="data.statusData.isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
