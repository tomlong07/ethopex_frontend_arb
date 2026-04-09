<script setup lang="ts">
const props = defineProps({
  classList: {
    type: String,
    required: false,
    default: '',
  },
})
</script>

<template>
  <div class="flex items-center">
    <div class="w-1/4">
      <n-skeleton text :repeat="1" :width="120" round />
    </div>
    <div class="w-3/4">
      <n-skeleton text :repeat="1" round :class="props.classList" />
    </div>
  </div>
</template>
