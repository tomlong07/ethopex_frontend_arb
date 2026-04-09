<template>
  <div
    v-if="dataConfig.googleTargetingConfig.data_source === 'sellers'"
    class="flex items-center my-4"
  >
    <FloatingWrapper
      :name="name"
      :required="true"
      :error="dataConfig.showErr['sellers']"
    >
      <n-input
        v-model:value="dataConfig.googleTargetingConfig.sellers"
        class="w-auto"
        placeholder="Enter placement URLs."
      />
    </FloatingWrapper>
  </div>
</template>
<script setup lang="ts">
import useGgTargetStore from '@/store/details/useGgTargetStore'
import FloatingWrapper from '../common/FloatingWrapper.vue';

const dataConfig = useGgTargetStore()
const name = `Sellers`
</script>
