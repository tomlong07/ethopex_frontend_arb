<script setup lang="ts">
const props = defineProps({
  cpc: {
    type: [String, Number],
    default: null,
  },
  bidding: {
    type: String,
    default: '',
  },
  campaignId: {
    type: [String, Number],
    required: true,
  },

  traffic_source: {
    type: String,
    default: '',
  },

  campaign_type: {
    type: String,
    default: '',
  },
})

let dataRender = props.cpc
  ? props.bidding === 'maximizeConversionValue'
    ? helper.floatWithCommas(props.cpc) + '%'
    : helper.currencyFormatterAuto2(props.cpc)
  : '-'
</script>

<template>
  <span :title="dataRender">
    {{ dataRender }}
  </span>
</template>
