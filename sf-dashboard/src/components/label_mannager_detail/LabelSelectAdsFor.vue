<script setup lang="ts">
import labelManagerDetail from '@/store/details/LabelManagerDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { AdsForOptions } from '@/options/label_manager'
const uselabelManagerDetail = labelManagerDetail()

const onUpdateAdsFor = async () => {
  uselabelManagerDetail.dataConfig.ads_type = null
}
</script>
<template>
  <div class="flex my-4">
    <div class="w-full">
      <FloatingWrapper name="Ads For">
        <n-select
          v-model:value="uselabelManagerDetail.dataConfig.ads_for"
          filterable
          :disabled="
            uselabelManagerDetail.isLoading || uselabelManagerDetail.isDisable
          "
          :options="AdsForOptions"
          placeholder=""
          @update:value="onUpdateAdsFor"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
