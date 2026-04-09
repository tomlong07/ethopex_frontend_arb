<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

let show = helper.getPostID(props.params.value)
</script>
<template>
  <span> {{ show }} </span>
</template>
