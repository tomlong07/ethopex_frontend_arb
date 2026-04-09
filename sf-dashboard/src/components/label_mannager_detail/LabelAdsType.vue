<script setup lang="ts">
import labelManagerDetail from '@/store/details/LabelManagerDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const uselabelManagerDetail = labelManagerDetail()
</script>
<template>
  <div class="flex my-4">
    <div class="w-full">
      <FloatingWrapper 
        name="Ads Type"
      >
        <n-select
          v-model:value="uselabelManagerDetail.dataConfig.ads_type"
          filterable
          :disabled="
            uselabelManagerDetail.isLoading ||
            uselabelManagerDetail.isDisable ||
            !uselabelManagerDetail.dataConfig.ads_for
          "
          :options="uselabelManagerDetail.adsTypeOptions"
          placeholder=""
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
