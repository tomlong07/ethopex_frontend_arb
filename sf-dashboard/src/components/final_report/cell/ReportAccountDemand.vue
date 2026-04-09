<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

let account_demand = props.params.data?.account_demand
if (!account_demand || account_demand?.id === 'unknown') account_demand = {}
</script>
<template>
  <div class="flex flex-col py-2" v-if="account_demand">
    <a
      v-if="account_demand?.id"
      :href="`/demand-account/${account_demand?.id}`"
      target="_blank"
      class="text-blue-500"
      >{{ account_demand?.name }}</a
    >
  </div>
</template>
