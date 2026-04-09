<script lang="ts" setup>
import { ICellRendererParams } from 'ag-grid-community'
const NestedList = defineAsyncComponent(() => import('./NestedList.vue'))

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
  oldValue: {
    type: String,
    default: '',
    required: true,
  },
  newValue: {
    type: String,
    default: '',
    required: true,
  },
})
</script>
<template>
  <div class="pb-1 mb-3 border-b">
    <h2 class="font-bold text-base text-slate-600">Audience changed</h2>
    <span
      >Audience changed on
      {{ props.params.data?.date_time_in_timezone || '' }}</span
    >
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div class="before">
      <div class="w-full font-bold">Before</div>
      <div class="text-gray-400">
        <NestedList :value="oldValue" />
      </div>
    </div>
    <div class="after">
      <div class="w-full font-bold">After</div>
      <div>
        <NestedList :value="newValue" />
      </div>
    </div>
  </div>
</template>
