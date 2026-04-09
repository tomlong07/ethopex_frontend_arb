<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { URL_UPLOAD } from '@/constants/urls';

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

</script>
<template>
  <img 
    v-if="props.params.value" 
    :src="`${URL_UPLOAD}${props.params.value}`" 
    alt="logo" 
    height="40" 
    width="40"
  />
</template>
