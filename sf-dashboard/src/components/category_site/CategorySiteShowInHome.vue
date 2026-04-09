<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'

const categorySiteStore = useCategorySite()
const { categorySite } = storeToRefs(categorySiteStore)
</script>

<template>
  <div class="flex-column items-center space-y-1">
    <div class="font-medium text-gray-400 text-xs">Show In Home</div>
    <div class="flex-1 min-w-0">
      <n-switch v-model:value="categorySite.show_in_home">
        <template #checked>ON</template>
        <template #unchecked>OFF</template>
      </n-switch>
    </div>
  </div>
</template>
