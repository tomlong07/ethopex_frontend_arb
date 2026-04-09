<script setup lang="ts">
const modelValue = defineModel<string>()
</script>
<template>
  <n-form-item
    label="Color Button"
    :label-style="{ fontWeight: 'bold', fontSize: '13px' }"
  >
    <n-color-picker
      v-model:value="modelValue"
      class="h-[37px]"
      placeholder="Color"
    />
  </n-form-item>
</template>
