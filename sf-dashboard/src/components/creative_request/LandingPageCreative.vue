<template>
  <div class="flex items-center">
    <div class="w-full flex items-center flex-grow">
      <FloatingWrapper :name="name" rounded>
        <n-select
          v-model:value="dataConfig.creativeRequestModel.landing_page_id"
          filterable
          value-field="id"
          label-field="name"
          placeholder="Select landing page"
          :loading="isLoadingLanding"
          :disabled="dataConfig.isCreatorMedia"
          :options="landingPageOptions"
          @search="handleLandingSearch"
          class="flex-grow"
        />
      </FloatingWrapper>

      <div class="ml-2 flex items-center">
        <n-button
          class="mr-2"
          color="#f43f5e"
          type="default"
          :disabled="slugLanding"
          :loading="isGetPreview"
          @click="previewAd"
        >
          Preview
        </n-button>
        <n-button
          color="#f43f5e"
          type="default"
          :disabled="dataConfig.isCreatorMedia || slugLanding"
          @click="editLandingPage"
        >
          Edit
        </n-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useCreativeRequestStore from '@/store/details/useCreativeStore'

import { ctr_landing_page } from '@/services/ctr_landing_page'
import { SelectOption } from 'naive-ui'
import { ctr_campaign } from '@/services/ctr_campaign'
import { TS } from '@/enum/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const dataConfig = useCreativeRequestStore()
const landingPageOptions = ref<SelectOption[]>([])
const isLoadingLanding = ref<boolean>(true)
const isGetPreview = ref<boolean>(false)

const name = 'Landing Page'

onMounted(async () => {
  await fetchLandingPageByDemand('')
})
const fetchLandingPageByDemand = async (q: string = '') => {
  isLoadingLanding.value = true
  const landingResult = await ctr_landing_page.GetLandingPages({
    q: q,
    demand_source: 'adsense',
    // ad_account: search_ad_account.value || campaign.value.account,
  })
  if (landingResult?.status) {
    landingPageOptions.value = landingResult?.data?.landing_pages || []
  }
  isLoadingLanding.value = false
}
const handleLandingSearch = async (query: string) => {
  if (query !== '') {
    await fetchLandingPageByDemand(query)
  } else {
    await fetchLandingPageByDemand('')
  }
}
const slugLanding = computed<boolean>(() => {
  if (!dataConfig.creativeRequestModel?.landing_page_id) {
    return true
  } else {
    return false
  }
})
const previewAd = async () => {
  isGetPreview.value = true
  const result = await ctr_campaign.GetPreview(landingPreviewInput.value)
  isGetPreview.value = false

  if (result?.status && result?.data) {
    window.open(result?.data, '_blank')
    return
  }
  window.message.error(
    `Failed to fetch account by demand: ${result?.errors[0].message}`
  )
}
const landingPreviewInput = computed(() => {
  return {
    landing_page_id: dataConfig.creativeRequestModel?.landing_page_id,
    traffic_source: TS.GOOGLE,
  }
})

const editLandingPage = () => {
  if (!dataConfig.creativeRequestModel?.landing_page_id) {
    return
  }

  window.open(
    `/landing_page/${dataConfig.creativeRequestModel.landing_page_id}`,
    '_blank'
  )
}
</script>
