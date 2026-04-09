<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
    default: 'text-green-500',
  },
  size: {
    type: String,
    default: '32',
  },
})
const emit = defineEmits(['handleAction'])

const handleAction = () => {
  emit('handleAction')
}
</script>

<template>
  <n-button @click="handleAction">
    <template #icon>
      <n-icon
        title="Change to original"
        class="cursor-pointer"
        :class="props.class"
        :size="props.size"
      >
        <slot></slot>
      </n-icon>
    </template>
  </n-button>
</template>
