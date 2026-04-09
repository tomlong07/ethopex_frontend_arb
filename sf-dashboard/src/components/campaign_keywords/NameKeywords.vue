<template>
  <div class="form-group flex items-center gap-4">
    <div class="flex-1">
      <FloatingWrapper
        name="Name"
      >
        <n-input
          v-model:value="campaignKeywordsStore.campaignKeyword.name"
          placeholder="Enter keywords manager name"
          clearable
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
<script setup lang="ts">
import { campaignKeywordsManagerStore } from '@/store/details/campaignKeywordsManagerStore'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const campaignKeywordsStore = campaignKeywordsManagerStore()
</script>
