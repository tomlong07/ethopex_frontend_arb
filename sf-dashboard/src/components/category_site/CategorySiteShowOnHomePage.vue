<script setup lang="ts">
const vModel = defineModel<boolean>()
</script>

<template>
  <div class="flex my-4">
    <div class="w-150-px font-bold">Show In Home</div>
    <div class="w-full">
      <n-switch v-model:value="vModel">
        <template #checked>ON</template>
        <template #unchecked>OFF</template>
      </n-switch>
    </div>
  </div>
</template>
