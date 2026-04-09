<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { DropdownOption } from 'naive-ui'
import { ColumnItem } from '@/types/state/general'
import { TS } from '@/enum/campaign'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
</script>
<template>
  <div class="overflow-hidden text-ellipsis whitespace-nowrap">
    <a
      :href="`/campaign/${TS.FACEBOOK}/${props.params.data?.new_campaign_id}`"
      target="_blank"
      class="text-blue-600 hover:text-red-500 hover:underline"
    >
      {{ props.params.data?.new_campaign_name }}
    </a>
  </div>
</template>
