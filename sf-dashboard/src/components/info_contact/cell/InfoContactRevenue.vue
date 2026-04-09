<script setup lang="ts">
import useInfoContact from '@/store/useInfoContact';
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const infoContactStore = useInfoContact()
</script>

<template>
  <div>
    {{ infoContactStore.formatCurrency(props.params?.data.daily_revenue_usd) }}
  </div>
</template>

