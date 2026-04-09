<script setup lang="ts">
import PixelTriggersDetail from '@/store/details/usePixelTriggersDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const usePixelTriggersDetail = PixelTriggersDetail()
</script>
<template>
  <div class="flex items-center">
    <div class="w-full flex flex-col">
      <FloatingWrapper
        name="Name"
      >
        <n-input
          v-model:value="usePixelTriggersDetail.pixelConfig.name"
          :disabled="
            usePixelTriggersDetail.isLoading || usePixelTriggersDetail.isDisable
          "
          maxlength="500"
          placeholder="Name of pixel trigger"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
