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
  <div class="flex flex-col py-2" v-if="props.params.data">
    <div
      v-if="
        props.params.data?.manager?.first_name ||
        props.params.data?.manager?.last_name
      "
    >
      {{ props.params.data?.manager?.first_name || '' }}
      {{ props.params.data?.manager?.last_name || '' }}
    </div>
    <div
      class="text-xs text-gray-500 italic"
      v-if="props.params.data?.manager?.email"
    >
      <a :href="`/user/${props.params.data?.manager?.id}`" target="_blank">
        {{ props.params.data?.manager?.email }}</a
      >
    </div>
  </div>
</template>
