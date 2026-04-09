<script setup lang="ts">
const vModel = defineModel<string>()
</script>

<template>
  <div class="flex my-4">
    <div class="w-150-px font-bold">Keyword</div>
    <div class="w-full flex flex-col">
      <n-input v-model:value="vModel" placeholder="Enter keyword " />
    </div>
  </div>
</template>
