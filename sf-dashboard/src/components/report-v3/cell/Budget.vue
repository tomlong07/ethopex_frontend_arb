<script setup lang="ts">
const props = defineProps({
  budget: {
    type: [String, Number],
    default: null,
  },
  budgetString: {
    type: String,
    required: false,
  },
})

const dataRender =
  props.budgetString ||
  (props.budget ? helper.currencyFormatterAuto2(props.budget, 2) : '-')
</script>

<template>
  <span :title="dataRender" class="truncate">
    {{ dataRender }}
  </span>
</template>
