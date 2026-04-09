<template>
  <div
    v-if="dataConfig.googleTargetingConfig.data_source === 'manual'"
    class="flex items-center my-4"
  >
    <FloatingWrapper
      :name="name"
      :required="true"
      :error="dataConfig.showErr['domains']"
    >
      <n-input
        v-model:value="dataConfig.googleTargetingConfig.domains"
        placeholder="Enter placement URLs line by line, or paste in a list."
        type="textarea"
        :autosize="{
          minRows: 5,
          maxRows: 10,
        }"
      />
    </FloatingWrapper>
  </div>
</template>
<script setup lang="ts">
import useGgTargetStore from '@/store/details/useGgTargetStore'
import FloatingWrapper from '../common/FloatingWrapper.vue';

const dataConfig = useGgTargetStore()
const name = `Domains`

</script>
