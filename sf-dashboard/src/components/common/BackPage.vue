<script setup lang="ts">
import ArrowBack from '@/assets/icons/ArrowBack.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
const goTo = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey || event.button === 1) {
    return
  }
  event.preventDefault()
  router.push({ path: props.url })
}
</script>
<template>
  <div :class="props.class">
    <n-popover trigger="hover">
      <template #trigger>
        <a
          :href="props.url"
          class="w-fit flex items-center cursor-pointer hover:text-green-600 custom-back-page"
          @click="goTo"
        >
          <n-icon size="24">
            <ArrowBack />
          </n-icon>
          <span class="text-sm ml-1">{{ `Back to ${props.name}` }}</span>
        </a>
      </template>
      <span>{{ `Page ${props.name}` }}</span>
    </n-popover>
  </div>
</template>
