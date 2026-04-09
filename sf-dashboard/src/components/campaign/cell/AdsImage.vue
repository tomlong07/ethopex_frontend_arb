<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const src = ref(props.params.data.media)

const isValidURL =
  props.params?.data?.media && !props.params?.data?.media.includes('null')
</script>
<template>
  <div size="tiny" class="flex items-end pb-1 pt-1 w-full h-full">
    <n-image
      :src="src"
      style="max-width: 100px; max-height: 60px"
      v-if="isValidURL"
    />
  </div>
</template>
