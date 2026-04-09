<script setup lang="ts">
import useAudienceStore from '@/store/useAudienceStore'
import AudienceDetail from '@/views/details/AudienceDetail.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const audienceStore = useAudienceStore()
const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass | undefined,
    required: false,
  },
})
</script>
<template>
  <n-modal
    preset="dialog"
    :show-icon="false"
    style="height: 80vh; width: 70vw"
    class="bg-base overflow-auto"
    v-model:show="audienceStore.showModal"
  >
    <AudienceDetail
      :campaign="props.campaign"
      :dataModal="audienceStore.dataModal"
    />
  </n-modal>
</template>
<style lang="scss"></style>
