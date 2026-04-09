<script lang="ts" setup>
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})

const values = props.params.value || []
</script>

<template>
  <div class="flex gap-1" v-if="values?.length">
    <n-tag v-for="(value, index) in values" :key="index" round type="info">
      {{ value }}</n-tag
    >
  </div>

  <span v-else>Click to Set</span>
</template>
