<script setup lang="ts">
import FloatingWrapper from "@/components/common/FloatingWrapper.vue";
import useNotifySystem from "@/store/details/useNotifySystem";

const notifySystemStore = useNotifySystem();
</script>

<template>
  <FloatingWrapper name="Message">
    <n-input v-model:value="notifySystemStore.payload.message" placeholder="" />
  </FloatingWrapper>
</template>
