<script setup lang="ts">
import useSegmentStore from '@/store/useSegmentModal'
import SegmentDetail from '@/views/details/SegmentDetail.vue'

const segmentStore = useSegmentStore()
</script>

<template>
  <div>
    <n-modal
      preset="dialog"
      :show-icon="false"
      style="height: 80vh; width: 70vw"
      class="bg-base overflow-auto"
      v-model:show="segmentStore.showModal"
    >
      <SegmentDetail :dataModal="segmentStore.dataModal" />
    </n-modal>
  </div>
</template>
