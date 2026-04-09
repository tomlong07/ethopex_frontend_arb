<script setup lang="ts">
const modelValue = defineModel<string>()
</script>
<template>
  <n-form-item
    label="Question"
    :label-style="{ fontWeight: 'bold', fontSize: '13px' }"
  >
    <n-input
      class="text-[13px]"
      v-model:value="modelValue"
      placeholder="Question"
    />
  </n-form-item>
</template>
