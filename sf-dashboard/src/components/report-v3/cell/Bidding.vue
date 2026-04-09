<script setup lang="ts">
import { FindBiddingLabel } from '@/labels/campaign'

const props = defineProps({
  bidding: {
    type: String,
    default: '',
  },

  traffic_source: {
    type: String,
    default: '',
  },

  campaign_type: {
    type: String,
    default: '',
  },
  campaignId: {
    type: [String, Number],
    required: true,
  },
})

const dataRender = props.bidding
  ? FindBiddingLabel(props.bidding, props.traffic_source, props.campaign_type)
  : ''
</script>

<template>
  <span :title="dataRender" class="truncate">
    {{ dataRender }}
  </span>
</template>
