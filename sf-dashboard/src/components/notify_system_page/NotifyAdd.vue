<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const navigatePageAdd = () => {
  router.push(`/notify-page/add`);
};
</script>

<template>
  <div class="flex flex-wrap px-4 py-2 gap-2 report-child-wrapper">
    <div class="flex items-center gap-2 ml-auto">
      <n-button size="small" color="#f43f5e" @click="navigatePageAdd">
        Add Notify
      </n-button>
    </div>
  </div>
</template>
