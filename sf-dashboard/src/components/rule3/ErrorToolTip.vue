<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  error?: string
}

const props = defineProps<Props>()
const hasError = computed(() => !!props.error)
</script>

<template>
  <n-tooltip trigger="hover" placement="top-end" :disabled="!hasError">
    <template #trigger>
      <div>
        <slot />
      </div>
    </template>

    <span v-if="hasError" class="max-w-sm text-xs">
      {{ error }}
    </span>
  </n-tooltip>
</template>
