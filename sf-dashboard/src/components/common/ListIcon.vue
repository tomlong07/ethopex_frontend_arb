<script setup lang="ts">
import ListStars from '@/assets/icons/ListStars.vue'

const props = defineProps({
  name: {
    type: String,
    required: false,
    default: 'List',
  },

  url: {
    type: String,
    required: true,
  },

  class: {
    type: String,
    required: false,
  },
})
</script>
<template>
  <n-popover trigger="hover">
    <template #trigger>
      <router-link :to="props.url" v-if="props.url" :class="props.class">
        <n-icon size="24" class="cursor-pointer icon-list-home">
          <ListStars />
        </n-icon>
      </router-link>
    </template>
    <span>{{ `Page ${props.name}` }}</span>
  </n-popover>
</template>
