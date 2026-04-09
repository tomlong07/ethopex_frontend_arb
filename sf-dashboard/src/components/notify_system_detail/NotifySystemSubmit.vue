<script setup lang="ts">
import useNotifySystem from "@/store/details/useNotifySystem";

const notifySystemStore = useNotifySystem();
</script>

<template>
  <div class="flex justify-end mt-4">
    <n-button
      type="error"
      @click="notifySystemStore.handleSubmit"
      :loading="notifySystemStore.isSubmitLoading"
    >
      Submit
    </n-button>
  </div>
</template>
