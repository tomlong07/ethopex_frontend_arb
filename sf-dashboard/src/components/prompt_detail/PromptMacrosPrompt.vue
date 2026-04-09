<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
const usePromtDetail = PromtDetail()

const macrosPrompt = ref([
  '{{title}}',
  '{{content_requirements}}',
  '{{language}}',
])
</script>
<template>
  <div>
    <div class="font-bold text-xs mb-1">Macros Prompt</div>
    <div class="flex gap-4">
      <n-tag
        type="info"
        v-for="item in macrosPrompt"
        :key="item"
        @click="usePromtDetail.copyMacro(item)"
        class="cursor-copy"
      >
        {{ item }}
      </n-tag>
    </div>
  </div>
</template>
