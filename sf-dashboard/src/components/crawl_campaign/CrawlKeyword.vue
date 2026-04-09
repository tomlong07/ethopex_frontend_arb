<script setup lang="ts">
import modalCrawlCamp from '@/store/modalCrawlCamp'
const storeModalCrawl = modalCrawlCamp()
</script>

<template>
  <n-button
    class="ml-auto pl-2 mr-4"
    color="#f43f5e"
    size="small"
    @click="storeModalCrawl.openModal()"
  >
    Generate AI Campaign
  </n-button>
</template>
