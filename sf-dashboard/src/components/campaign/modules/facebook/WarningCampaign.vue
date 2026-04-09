<script setup lang="ts">
import ErrorIcon from '@/assets/icons/ErrorIcon.vue'
import { NIcon } from 'naive-ui'
const props = defineProps({
  warning: {
    type: Object,
    required: false,
  },
})
</script>

<template>
  <n-tooltip v-if="props.warning" trigger="hover">
    <template #trigger>
      <n-icon size="20" color="orange" class="!mt-0">
        <ErrorIcon />
      </n-icon>
    </template>
    <div v-if="props.warning?.recommendation_content?.lift_estimate">
      Recommendations: {{ props.warning.recommendation_content.lift_estimate }}
    </div>
    <div v-else>
      {{ JSON.stringify(props.warning, null, 2) }}
    </div>
  </n-tooltip>
</template>
