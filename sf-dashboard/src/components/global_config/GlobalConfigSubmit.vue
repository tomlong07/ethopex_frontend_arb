<script setup lang="ts">
import { useGlobalConfig } from '@/store/details/globalConfig'
const globalConfigStore = useGlobalConfig()
</script>

<template>
  <div class="flex flex-row-reverse sticky bottom-0 p-2">
    <n-button
      color="#f43f5e"
      size="medium"
      type="success"
      :loading="globalConfigStore.isSubmitBtnLoading"
      @click="globalConfigStore.submitForm"
    >
      Submit
    </n-button>
  </div>
</template>
