<script setup lang="ts">
import { useGoogleExcludeList } from "@/store/details/googleExcludeList";

const googleExcludeListStore = useGoogleExcludeList();
</script>

<template>
  <div class="flex flex-row-reverse sticky bottom-0 py-2">
    <n-button
      color="#f43f5e"
      size="medium"
      type="success"
      @click="googleExcludeListStore.submitForm"
    >
      Submit
    </n-button>
  </div>
</template>
