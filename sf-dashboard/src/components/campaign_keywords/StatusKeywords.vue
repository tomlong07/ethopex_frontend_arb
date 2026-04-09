<script setup lang="ts">
import { campaignKeywordsManagerStore } from '@/store/details/campaignKeywordsManagerStore'
import CustomSwitch from '../common/CustomSwitch.vue'

const campaignKeywordsStore = campaignKeywordsManagerStore()
</script>

<template>
  <div class="form-group flex items-center gap-4">
    <label class="text-xs font-medium text-gray-700 w-12 flex-shrink-0">
      Status
    </label>
    <div class="flex-1">
      <CustomSwitch
        v-model="campaignKeywordsStore.campaignKeyword.status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
