<script setup lang="ts">
import CreativeFanpage from '@/components/campaign/modules/facebook/Ads/CreativeFanpage.vue'
import CreativePostID from '@/components/campaign/modules/facebook/Ads/CreativePostID.vue'

import { StatusCreativeManager } from '@/types/components/creative-v2'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'

import useAdDataStore from '@/store/adDataStore'
import { SelectOptionsManager } from '@/types/components/campaign-v2'
import { ctr_creative } from '@/services/ctr_creative'
import Close2 from '@/assets/icons/Close2.vue'

const adDataStore = useAdDataStore()

const status = ref(new StatusCreativeManager())
const optionsManager = ref(new SelectOptionsManager())

const submitForm = async () => {
  status.value.isSubmitting = true

  const result = await ctr_creative.UpdateAds(adDataStore.payloadExist)

  if (result?.status) {
    window.message.success('Ad updated successfully')
    adDataStore.changeOrigin()
    closeModal()
    adDataStore.reloadFanpage = Date.now()
  }

  status.value.isSubmitting = false
}

onMounted(() => {
  status.value.isLoading = false
})

watch(
  () => adDataStore.dataModal,
  async (newValue, oldValue) => {
    if (newValue) {
      optionsManager.value.fetchFanpageOptions()
    }
  }
)

const closeModal = () => {
  adDataStore.showModalExist = false
}
</script>

<template>
  <n-modal
    v-model:show="adDataStore.showModalExist"
    style="height: 500px; width: 768px"
  >
    <n-card class="overflow-y-scroll">
      <template #header
        >Ad of creative:
        {{
          adDataStore.dataModal?.name +
          ' (ID: ' +
          adDataStore.dataModal?.id +
          ')'
        }}</template
      >

      <template #header-extra>
        <n-icon
          size="26"
          class="ml-auto button-close cursor-pointer"
          @click="closeModal"
          ><Close2 /></n-icon
      ></template>
      <div class="flex flex-col px-3 flex-1 bg-white">
        <div class="flex flex-col my-12 flex-1 gap-4">
          <div v-if="status.isLoading">
            <Skeleton />
          </div>
          <div class="flex flex-col flex-1 gap-4" v-else>
            <CreativeFanpage
              :adcreative="adDataStore.dataModal"
              :optionsManager="optionsManager"
            />

            <CreativePostID
              :adcreative="adDataStore.dataModal"
              :optionsManager="optionsManager"
            />
          </div>
        </div>

        <div class="flex flex-row-reverse sticky bottom-0 p-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="status.isSubmitting"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>
