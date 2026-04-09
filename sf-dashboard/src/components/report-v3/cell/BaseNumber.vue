<script setup lang="ts">
import { ReportColumn } from '@/types/state/report'

const props = defineProps({
  data: {
    type: null,
    required: true,
  },

  plus: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const opts = new ReportColumn(props.plus)

const symbol = opts?.symbol || ''
const leftSymbol = opts?.leftSymbol || false

let dataRaw = '-'
try {
  dataRaw = props.data
} catch {}

const formatValue = ref()

try {
  formatValue.value = helper.formatNumberV3(dataRaw, opts.precision)
} catch (error) {
  console.error(error)
}

const showSymbol = computed(() => {
  return symbol && formatValue.value !== '-'
})

const formatNumberByValue = (value: any) => {
  const res = helper.formatNumberV3(value, opts.precision)
  if (res === '-') {
    return ''
  }

  return res
}
</script>

<template>
  <template v-if="leftSymbol && showSymbol">{{ symbol }}</template
  >{{ formatNumberByValue(dataRaw) }}
  <template v-if="!leftSymbol && showSymbol">{{ symbol }}</template>
</template>
