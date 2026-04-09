<script setup lang="ts">
import { TType } from '@/enum/naiveui'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },

  offUppercase: {
    type: Boolean,
    default: false,
  },
})

const classRender = props.offUppercase ? 'capitalize' : 'uppercase'

const classNow = computed<any>(() => {
  return (helper.classRender(props.params?.value || '') as TType) || undefined
})

const styleNow = computed<any>(() => {
  const value = props.params?.value.toLowerCase()
  switch (value) {
    case 'queue':
      return { color: 'white', textColor: '#48abf7', borderColor: '#48abf7' }

    case 'notfound':
      return {
        color: 'rgb(104, 97, 206)',
        textColor: 'white',
      }

    case 'running':
      return {
        color: 'rgb(0, 123, 255, 0.7)',
        textColor: 'white',
      }
  }

  return undefined
})
</script>
<template>
  <div
    class="flex h-full items-center"
    v-if="props.params?.value && props.params?.value != ''"
  >
    <n-tag
      size="small"
      :class="classRender"
      round
      class="n-tag-exclude"
      :type="classNow"
      :color="styleNow"
    >
      {{ props.params?.value || '' }}
    </n-tag>
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
