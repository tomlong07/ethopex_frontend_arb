<script setup lang="ts">
import LayoutDetail from '@/store/details/LayoutDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const useLayoutDetail = LayoutDetail()
</script>

<template>
  <div class="sm:flex gap-2">
    <div class="flex-1 min-w-0">
      <FloatingWrapper
        name="Name"
        :required="true"
        :error="useLayoutDetail.showErr['name']"
      >
        <n-input
          v-model:value="useLayoutDetail.layoutConfig.name"
          class="h-full"
          placeholder="Name"
          maxlength="500"
          :disabled="useLayoutDetail.isSubmitBtnLoading"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
