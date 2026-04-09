<script setup lang="ts">
const macros: string[] = ['${city}$', '${country}$', '${month}$', '${keyword}$']

const copyMacro = (macro: string) => {
  helper.copyText(macro)
  window.message.success('Copied')
}
</script>
<template>
  <div class="font-bold flex text-xs -mb-1">Macros</div>
  <n-flex size="medium" class="mb-2">
    <n-tag
      :bordered="false"
      type="info"
      size="small"
      class="cursor-copy n-tag-exclude"
      @click="copyMacro(item)"
      v-for="(item, index) in macros"
      :key="index"
    >
      {{ item }}
    </n-tag>
  </n-flex>
</template>
