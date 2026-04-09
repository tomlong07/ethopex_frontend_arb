<script setup lang="ts">
import { ctr_campaign } from '@/services/ctr_campaign'
import { landingTypeClass } from '@/types/components/landing'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const getTonicApi = async () => {
  const demand_tonic = {
    demand_source: 'tonic',
  }
  const resultTonic = await ctr_campaign.APIGetLandingPage(demand_tonic)
  if (resultTonic.status === true) {
    window.message.success(`Submit success!`)
  }
}
</script>
<template>
  <n-card v-if="props.landing.IsDemandTonic()" title="Tonic">
    <n-button type="warning" class="mb-4" @click="getTonicApi">
      API Get LandingPage
    </n-button>
  </n-card>
</template>
