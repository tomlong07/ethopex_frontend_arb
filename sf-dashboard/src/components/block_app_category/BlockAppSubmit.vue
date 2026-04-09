<script setup lang="ts">
import { useBlockAppCategory } from '@/store/details/blockAppCategory'
const blockAppCategoryStore = useBlockAppCategory()
</script>

<template>
  <div class="flex flex-row-reverse sticky bottom-0 py-2">
    <n-button
      color="#f43f5e"
      size="medium"
      type="success"
      :loading="blockAppCategoryStore.isSubmitBtnLoading"
      @click="blockAppCategoryStore.submitForm"
    >
      Submit
    </n-button>
  </div>
</template>
