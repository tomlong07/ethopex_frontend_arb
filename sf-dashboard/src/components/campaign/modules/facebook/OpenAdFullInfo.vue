<script setup lang="ts">
import { FreezeClass } from '@/types/components/campaign-v2'

import useFbManualAdsStore from '@/store/useFbManualAdsStore'

const fbManualAdsStore = useFbManualAdsStore()

const props = defineProps({
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const openModalManualAds = () => {
  if (fbManualAdsStore.showModal) {
    fbManualAdsStore.changeShowModal(false)
    return
  }
  fbManualAdsStore.changeShowModal(true)
  fbManualAdsStore.changeDataModal(
    props.FreezeData.isEditPage()
      ? props.FreezeData.id
      : props.FreezeData.duplicateId
  )
}
</script>

<template>
  <n-button @click="openModalManualAds" type="info" class="ml-auto"
    >{{ fbManualAdsStore.showModal ? 'Hide' : 'View' }} Ads</n-button
  >
</template>
