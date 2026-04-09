<script setup lang="ts">
import ReportDown from '@/assets/icons/ReportDown.vue'
import ReportUp from '@/assets/icons/ReportUp.vue'

const props = defineProps({
  diff: {
    type: Number,
    required: true,
  },

  diffText: {
    type: String,
    required: true,
  },

  className: {
    type: String,
    required: true,
  },
  titleNow: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <span
    class="span-comparison inline-flex items-center"
    :class="props.className"
    :title="props.titleNow"
  >
    <ReportUp v-if="props.diff > 0" />
    <ReportDown v-if="props.diff < 0" />

    <span>{{ props.diffText }}</span></span
  >
</template>
