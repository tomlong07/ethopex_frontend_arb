<script setup lang="ts">
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import { NIcon } from 'naive-ui'

const props = defineProps({
  data: {
    type: Object as () => any,
    required: true,
  },
})
</script>

<template>
  <div class="overflow-hidden">
    <div class="text-blue-link overflow-hidden text-ellipsis">
      {{ props.data?.landing_page?.name || 'N/A' }}
    </div>
    <div style="color: #4c4c4c" class="text-xs overflow-hidden text-ellipsis">
      {{ props.data?.landing_page?.user || '' }}
    </div>
  </div>
  <a
    :href="`landing_page/${props.data?.landing_page?.id}`"
    target="_blank"
    v-if="props.data?.landing_page?.id"
  >
    <n-icon
      class="hover:scale-105"
      :component="Settings20Regular"
      size="24"
      title="Settings"
    ></n-icon>
  </a>
</template>
