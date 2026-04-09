<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Remove this media',
  },

  class: {
    type: String,
    default: '',
  },

  size: {
    type: String,
    default: '18',
  },

  placement: {
    type: String as PropType<any>,
    default: 'top',
  },
})

const onClick = () => {
  emit('onClick')
}

const emit = defineEmits<{
  (e: 'onClick'): void
}>()
</script>

<template>
  <n-tooltip trigger="hover" v-if="props.text" :placement="props.placement">
    <template #trigger>
      <n-icon
        :size="props.size"
        class="absolute remove-media button-editor-image cursor-pointer not-filter-icon"
        :class="props.class"
        @click="onClick"
      >
        <Close />
      </n-icon>
    </template>
    <span>{{ props.text }}</span>
  </n-tooltip>

  <n-icon
    v-else
    :size="props.size"
    class="absolute remove-media button-editor-image cursor-pointer"
    :class="props.class"
    @click="onClick"
  >
    <Close />
  </n-icon>
</template>

<style scoped lang="scss">
.remove-media {
  top: -10px;
  right: -10px;
  background: #ccc;
  border-radius: 20px;

  &.remove-media-2 {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  &:hover {
    color: white;
    background-color: #d03050;
  }
}
</style>
