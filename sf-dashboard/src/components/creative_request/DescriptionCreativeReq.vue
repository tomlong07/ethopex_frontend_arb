<script setup lang="ts">
import useCreativeRequestStore from '@/store/details/useCreativeStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = useCreativeRequestStore()

const name = 'Description'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="dataConfig.creativeRequestModel.description"
      placeholder=""
      type="textarea"
      :disabled="dataConfig.isCreatorMedia"
      :autosize="{ minRows: 5, maxRows: 7 }"
    />
  </FloatingWrapper>
</template>
