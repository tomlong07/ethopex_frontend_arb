<script setup lang="ts">
import ErrorIcon from '@/assets/icons/ErrorIcon.vue'

const props = defineProps({
  item: {
    type: Object as () => any,
    required: true,
  },
})
</script>

<template>
  <n-popover trigger="hover" v-if="props.item.error">
    <template #trigger>
      <n-icon
        :component="ErrorIcon"
        size="18"
        class="absolute -left-6 top-0"
        color="#EF4444"
      />
    </template>
    {{ props.item.error }}
  </n-popover>
</template>
