<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
  data: {
    type: Object as () => any,
    default: () => {},
    required: false,
  },
})

const linkAhref = ref('#')
if ((props.params as any).columnConfig?.link && props.params.value) {
  if (
    (props.params.value && String(props.params.value).includes('http')) ||
    (props.params as any).columnConfig.link === 'http'
  ) {
    linkAhref.value = props.params.value
  } else {
    let link = (props.params as any).columnConfig.link
    const macros = helper.getMacros((props.params as any).columnConfig.link)
    if (macros && macros.length) {
      macros.forEach((macro) => {
        if (macro === 'value') {
          link = link.replace(`{{${macro}}}`, props.params.value)
        } else {
          link = link.replace(
            `{{${macro}}}`,
            props.params.data[macro as any] || 'test'
          )
        }
      })
    }

    linkAhref.value = link
  }
}
</script>

<template>
  <div class="overflow-hidden text-ellipsis">
    <span v-if="!props.params.value"></span>
    <a
      class="text-blue-500 hover:text-red-500"
      :href="linkAhref"
      target="_blank"
      v-else
      >{{ props.params.value }}</a
    >
  </div>
</template>
