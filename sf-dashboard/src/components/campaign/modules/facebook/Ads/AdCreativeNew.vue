<script setup lang="ts">
import {
  campaignTypeClass,
  creativeStruct,
  SelectOptionsManager,
} from '@/types/components/campaign-v2'
import useCreativeAdNew from '@/store/campaign/creativeAdNew'
import { ModalStateCreative } from '@/types/components/modal'
import CreativeDetail3 from '@/views/details/CreativeDetail3.vue'

const creativeAdNewStore = useCreativeAdNew()

const props = defineProps({
  adcreative: {
    type: Object as () => creativeStruct,
    required: true,
  },

  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  optionsManager: {
    type: Object as () => SelectOptionsManager,
    required: true,
  },
})

watch(
  () => props.adcreative.creative_id,
  (newVal) => {
    if (newVal) {
      let newData: ModalStateCreative = {
        type: props.campaign.campaign_type,
        traffic_source: props.campaign.traffic_source,
        modalMenu: true,
        id: newVal,
      }
      creativeAdNewStore.changeDataModal(newData)
    }
  }
)

const creComp = ref<InstanceType<typeof CreativeDetail3> | null>(null)

const test = () => {
  if (creComp.value) {
    console.log('Payload: ', creComp.value.getPayload())
  }
}
</script>

<template>
  <n-card
    v-if="props.adcreative.creative_id"
    title="Creative Detail"
    class="rounded-[5px] !border-gray2"
  >
    <CreativeDetail3
      :key="props.adcreative.creative_id"
      :dataModal="creativeAdNewStore.dataModal"
      :disabledType="true"
      ref="creComp"
    />

    <n-button @click="test()">Test</n-button>
  </n-card>
</template>
