<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'
import Tick from '@/assets/icons/Tick.vue'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
  },
})
</script>

<template>
  <div>
    <n-icon v-if="props.params?.data?.agreement" :component="Tick" size="24" />
    <n-icon v-else :component="Close" color="red" size="24" />
  </div>
</template>
