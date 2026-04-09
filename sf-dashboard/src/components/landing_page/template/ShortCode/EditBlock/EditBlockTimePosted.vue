<script setup lang="ts">
const modelValue = defineModel<string>()
</script>
<template>
  <n-form-item
    label="Posting time"
    :label-style="{ fontWeight: 'bold', fontSize: '13px' }"
  >
    <n-input
      class="text-[13px]"
      v-model:value="modelValue"
      placeholder="2 days ago"
    />
  </n-form-item>
</template>
