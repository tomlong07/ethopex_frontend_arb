<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
const assetGroupStore = useAssetGroupDetail()
</script>

<template>
  <div class="flex flex-row-reverse sticky bottom-0 p-2">
    <n-button
      color="#f43f5e"
      size="medium"
      type="success"
      :loading="assetGroupStore.isSubmitBtnLoading"
      @click="assetGroupStore.submitForm"
    >
      Submit
    </n-button>
  </div>
</template>
