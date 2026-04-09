<script setup lang="ts">
import { ColumnItem } from '@/types/state/general'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem

const fullData =
  props.params.value?.filter(
    (item: any) => item !== null && item !== undefined && item !== 0
  ) || []

const linkValue = (value: string) => {
  return options.link?.replace('{{value}}', value)
}
</script>

<template>
  <div class="overflow-hidden text-ellipsis flex">
    <div :key="index" v-for="(link, index) in fullData">
      <a
        class="text-blue-500 hover:text-red-500"
        :href="linkValue(link)"
        target="_blank"
        >{{ link }}</a
      >
      <span v-if="index != fullData?.length - 1">,&nbsp;</span>
    </div>
  </div>
</template>
