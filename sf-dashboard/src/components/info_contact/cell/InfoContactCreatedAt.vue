<script setup lang="ts">
import helper from '@/utils/helper';
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})

</script>

<template>
  <div>
    <div class="truncate">
      {{ helper.convertToVNTime(props.params.data.created_at) }}
    </div>
  </div>
</template>
