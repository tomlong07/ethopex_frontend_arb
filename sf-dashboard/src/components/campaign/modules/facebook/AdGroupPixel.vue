<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import { usePresetCampaign } from '@/store/campaign/usePresetCampaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const store = usePresetCampaign()

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },

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

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI() && props.campaign.account_supply_id
    ? true
    : false
})

watch(
  () => props.campaign.account_supply_id,
  async (newValue, oldValue) => {
    // store.skipNextAccountFetch để tránh call api 2 lần
    if (
      newValue &&
      newValue !== oldValue &&
      props.campaign.IsAPI() &&
      String(store.skipNextAccountFetch) !== String(newValue)
    ) {
      await getFBPixels()
    }
  }
)

//đang bị call api 2 lần
watch(
  () => props.statusData.loadingPixel,
  async (newValue, oldValue) => {
    if (newValue && props.campaign.IsAPI()) {
      await getFBPixels()
    }
  }
)

// onMounted(async () => {
//   if (isShow.value) {
//     getFBPixels()
//   }
// })

const isFirstInit = ref<boolean>(true)

const getFBPixels = async (sync = false) => {
  if (!props.campaign.account_supply_id) return //đảm bảo khi ko có id thì ko fetch
  isLoading.value = true
  await store.GetFbPixel(
    props.campaign.account_supply_id,
    sync ? props.campaign.traffic_source : ''
  )

  isLoading.value = false

  if (
    isFirstInit.value &&
    props.FreezeData.isDuplicatePageV2() &&
    props.adgroup.pixel
  ) {
    isFirstInit.value = false
    const pixel = store.pixelOptions.find(
      (item) => item.id === props.adgroup.pixel
    )

    if (!pixel) {
      props.adgroup.pixel = null
      window.message.warning(
        'Pixel not found in this account. Selection cleared.'
      )
    }
  }
}

const updatePixel = (value: string) => {
  props.adgroup.pixel = value
  props.adgroup.conversion_event = null
}

const isDisabled = computed(() => {
  if (props.FreezeData.isEditPage() && props.campaign.IsNotPushToAPI()) {
    if (props.campaign.IsTrafficFacebook()) return false
  }

  if (!isShow.value) return true

  if (
    props.FreezeData.isEditPage() &&
    !!props.adgroup.id &&
    !!props.adgroup.ad_group_id
  )
    return true

  return false
})

const alreadySync = ref<boolean>(false)

watch(
  () => props.campaign.account_supply_id,
  (newValue, oldValue) => {
    //Mở nút sync khi đổi account
    if (alreadySync.value) {
      alreadySync.value = false
    }
  }
)

const syncPixel = async () => {
  if (alreadySync.value) return

  alreadySync.value = true

  await getFBPixels(true)
}

const name = 'Pixel'
</script>

<template>
  <FloatingWrapper :name="name" rounded required>
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <n-select
        value-field="id"
        label-field="name"
        filterable
        v-model:value="props.adgroup.pixel"
        :placeholder="name"
        :disabled="isDisabled"
        :options="store.pixelOptions"
        :on-update:value="updatePixel"
        :loading="store.isLoadingPixel"
      />

      <n-button
        @click="syncPixel"
        v-if="props.campaign.IsTrafficFacebook()"
        :disabled="isLoading || isDisabled || alreadySync"
        >Sync</n-button
      >
      <n-button @click="store.openModal">Preset </n-button>
    </div>
  </FloatingWrapper>
</template>
