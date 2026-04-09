<script setup lang="ts">
import labelManagerDetail from '@/store/details/LabelManagerDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const uselabelManagerDetail = labelManagerDetail()
</script>
<template>
  <div class="flex my-4">
    <div class="w-full flex flex-col">
      <FloatingWrapper 
        name="Name"
      >
        <n-input
          v-model:value="uselabelManagerDetail.dataConfig.name"
          :loading="uselabelManagerDetail.isLoading"
          :disabled="
            uselabelManagerDetail.isLoading || uselabelManagerDetail.isDisable
          "
          maxlength="500"
          :placeholder="`Name of ${uselabelManagerDetail.name}`"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
