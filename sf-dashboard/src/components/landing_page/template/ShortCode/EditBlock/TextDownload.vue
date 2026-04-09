<script setup lang="ts">
const modelValue = defineModel<string>()
</script>
<template>
  <n-form-item
    label="Text Download"
    :label-style="{ fontWeight: 'bold', fontSize: '13px' }"
  >
    <n-input
      class="text-[13px]"
      v-model:value="modelValue"
      placeholder="Text Download"
    />
  </n-form-item>
</template>
