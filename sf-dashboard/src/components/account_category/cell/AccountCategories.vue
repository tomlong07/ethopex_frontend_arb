<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

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

const linkCategory = async (id: number) => {
  const categoryId = `category/edit/${id}`
  window.open(categoryId, '_blank')
}
</script>
<template>
  <span class="capitalize">
    <n-tag
      v-for="(item, index) in arrayValue"
      :key="index"
      size="small"
      round
      class="cursor-pointer"
      :class="{ 'ml-1': index != 0 }"
      type="info"
      @click="linkCategory(item.id)"
    >
      {{ item.name }}
    </n-tag>
  </span>
</template>
