<script setup lang="ts">
import { NTag } from 'naive-ui'

const props = defineProps({
  name: {
    type: String,
    default: 'N/A',
  },

  created_by: {
    type: String,
    default: '',
  },

  href: {
    type: String,
    required: true,
  },

  tagInfo: {
    type: Object,
    default: () => null,
  },
})
</script>

<template>
  <div class="flex w-full items-center gap-2">
    <div class="overflow-hidden">
      <a
        :href="props.href"
        target="_blank"
        style="color: #2a61b1"
        class="block overflow-hidden text-ellipsis"
        >{{ props.name }}</a
      >
      <!-- <div style="color: #4c4c4c" class="text-xs overflow-hidden text-ellipsis">
        {{ props.created_by }}
      </div> -->
    </div>

    <div class="ml-auto flex items-center gap-2">
      <n-tag
        round
        class="text-xs n-tag-exclude"
        :type="props.tagInfo.type"
        size="small"
        v-if="props.tagInfo"
        >{{ props.tagInfo.text }}</n-tag
      >
    </div>
  </div>
</template>
