<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

</script>
<template>
  <a target="_blank" :href="`/user/${props.params.data.create_by.id}`">
    <span>
      {{ props.params.data.create_by.email }}
    </span>
  </a>
</template>
