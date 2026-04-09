<template>
  <FloatingWrapper
    name="Note"
    class="my-5"
  >
    <n-input
      v-model:value="dataConfig.fundsConfig.note"
      placeholder="Note"
      type="textarea"
      :disabled="dataConfig.isDisabled"
      :autosize="{
        minRows: 3,
        maxRows: 5,
      }"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import useFundsStore from '@/store/details/useFundsStore'
import FloatingWrapper from '../common/FloatingWrapper.vue';

const dataConfig = useFundsStore()
</script>
