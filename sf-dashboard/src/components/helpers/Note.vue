<script lang="ts" setup>
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },

  size: {
    type: Number,
    default: 12,
  },
})
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-icon :size="props.size" class="cursor-pointer">
        <QuestionCircleRegular />
      </n-icon>
    </template>
    <span>{{ props.text }} </span>
  </n-popover>
</template>
