<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()
</script>

<template>
  <div class="w-40 text-xs">
    <n-input
      v-if="templateV2Store.baseConfigs.HasSearch()"
      v-model:value="templateV2Store.search"
      size="small"
      type="text"
      placeholder="Search..."
      clearable
    />
  </div>
</template>
