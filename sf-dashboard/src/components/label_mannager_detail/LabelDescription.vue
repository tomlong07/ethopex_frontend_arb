<script setup lang="ts">
import labelManagerDetail from '@/store/details/LabelManagerDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const uselabelManagerDetail = labelManagerDetail()
</script>

<template>
  <div class="flex my-4">
    <div class="w-full">
      <FloatingWrapper 
        name="Description"
      >
        <n-input
          v-model:value="uselabelManagerDetail.dataConfig.description"
          type="textarea"
          placeholder="Description"
          :disabled="uselabelManagerDetail.isLoading"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
