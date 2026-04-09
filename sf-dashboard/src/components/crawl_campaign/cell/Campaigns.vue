<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const campaigns = props.params?.data?.campaign_ids?.filter(
  (item: any) => !!item
)
</script>

<template>
  <div class="overflow-hidden text-ellipsis flex">
    <div :key="index" v-for="(link, index) in campaigns">
      <a
        class="text-blue-500 hover:text-red-500"
        :href="`/campaign/${props.params.data.traffic_source}/${link}`"
        target="_blank"
        >{{ link }}</a
      >
      <span v-if="index != props.params.data.campaign_ids.length - 1"
        >,&nbsp;</span
      >
    </div>
  </div>
</template>
