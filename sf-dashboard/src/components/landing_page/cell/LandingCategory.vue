<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const arrayValue = computed<string>(() => {
  return props.params.value.split(', ')
})
</script>
<template>
  <n-tooltip trigger="hover" v-if="props.params.value !== ''">
    <template #trigger>
      <div
        style="
          display: flex;
          align-items: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        "
      >
        <div id="landing-category" class="max-w-full">
          <n-tag
            v-for="(item, index) in arrayValue"
            :key="index"
            size="small"
            round
            style="flex-shrink: 0; margin-right: 4px; width: 100%"
            type="info"
            class="n-tag-exclude"
          >
            {{ item }}
          </n-tag>
        </div>
      </div>
    </template>
    {{ props.params.value }}
  </n-tooltip>
</template>
<style>
#landing-category .n-tag__content {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
