<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

let link: string = ''

if (props.params.value) {
  if (
    !props.params.value.startsWith('http://') &&
    !props.params.value.startsWith('https://')
  ) {
    link = 'https://' + props.params.value
  } else {
    link = props.params.value
  }
}
</script>

<template>
  <a
    :href="link"
    v-if="props.params.value && link"
    target="_blank"
    class="text-blue-500"
  >
    {{ props.params.value }}
  </a>
</template>
