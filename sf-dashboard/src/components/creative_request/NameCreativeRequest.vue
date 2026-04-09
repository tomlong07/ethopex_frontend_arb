<script setup lang="ts">
import useCreativeRequestStore from '@/store/details/useCreativeStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = useCreativeRequestStore()

const name = 'Name'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="dataConfig.creativeRequestModel.name"
      placeholder="Name"
      :disabled="dataConfig.isCreatorMedia"
      @keydown.enter.prevent
    />
  </FloatingWrapper>
</template>
