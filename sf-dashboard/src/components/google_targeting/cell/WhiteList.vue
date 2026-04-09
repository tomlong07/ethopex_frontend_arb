<script lang="ts" setup>
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const valueShow = helper.capitalizeFirstLetter(props.params.value)

const typeNow = computed(() => {
  switch (props.params.value) {
    case 'whitelist':
      return 'success'
    case 'blacklist':
      return 'error'
  }
  return
})

const colorNow = computed(() => {
  if (props.params.value === 'unknow') {
    return { color: '#e7e7e7' }
  }

  return
})
</script>

<template>
  <n-tag class="n-tag-exclude" :type="typeNow" round :color="colorNow">{{
    valueShow
  }}</n-tag>
</template>
