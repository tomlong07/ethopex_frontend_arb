<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const idCampaign = computed<number>(() => {
  return props.params.value
})
const traffic = computed<string>(() => {
  return props.params.data.traffic_source
})

const linkCampaign = async () => {
  const campaignId = `campaign/${traffic.value}/${idCampaign.value}`
  window.open(campaignId, '_blank')
}
</script>
<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <a
        class="cursor-pointer text-blue-500 no-underline hover:underline"
        target="_blank"
        @click="linkCampaign()"
      >
        {{ idCampaign }}
      </a>
    </template>
    {{ idCampaign }}
  </n-tooltip>
</template>
