<script lang="ts" setup>
import Activity from '@/views/Activity.vue'
import useActivityStore from '@/store/useActivityStore'
const activityStore = useActivityStore()
</script>

<template>
  <n-modal
    id="logCampaign"
    v-model:show="activityStore.showModal"
    preset="card"
    title="Log Campaign"
    size="huge"
    :style="{
      width: '95vw',
      height: '90vh',
    }"
    :bordered="false"
    :segmented="{
      content: 'soft',
      footer: 'soft',
    }"
  >
    <template #header-extra></template>
    <n-scrollbar
      style="max-height: calc(90vh - 160px)"
      class="border-b-2 relative bg-gray-100"
    >
      <Activity :isModal="true" />
    </n-scrollbar>
  </n-modal>
</template>
