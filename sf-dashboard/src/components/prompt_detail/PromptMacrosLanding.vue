<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
const usePromtDetail = PromtDetail()
const macrosLanding = ref(['${city}$', '${country}$', '${month}$'])
</script>
<template>
  <div>
    <div class="font-bold text-xs mb-1">Macros Landing</div>
    <div class="flex gap-4">
      <n-tag
        type="info"
        v-for="item in macrosLanding"
        :key="item"
        @click="usePromtDetail.copyMacro(item)"
        class="cursor-copy"
      >
        {{ item }}
      </n-tag>
    </div>
  </div>
</template>
