<script setup lang="ts">
import useNotifySystem from "@/store/details/useNotifySystem";
import CustomSwitch from "../common/CustomSwitch.vue";

const notifySystemStore = useNotifySystem();
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="text-xs w-16 font-bold">Status</div>
    <div class="flex-1">
      <CustomSwitch
        v-model="notifySystemStore.payload.status"
        type="onoff"
        true-label="On"
        false-label="Off"
      />
    </div>
  </div>
</template>
