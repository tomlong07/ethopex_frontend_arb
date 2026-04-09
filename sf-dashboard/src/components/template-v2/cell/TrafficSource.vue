<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const arrayValue = computed<any>(() => {
  return props.params.value
})

const trafficName = computed(() => {
  const itemsV2 = templateV2Store.trafficOptions || []
  const selectedItem = itemsV2.find((item) => item.value === arrayValue.value)
  return selectedItem ? selectedItem.label : arrayValue.value
})
</script>
<template>
  <span>
    {{ trafficName }}
  </span>
</template>
