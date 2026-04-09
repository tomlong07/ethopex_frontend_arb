<script setup lang="ts">
import LayoutDetail from '@/store/details/LayoutDetail'
import { LayoutTypeOptions } from '@/options/layout'
import FloatingWrapper from '../common/FloatingWrapper.vue';
const useLayoutDetail = LayoutDetail()
</script>
<template>
  <div class="sm:flex gap-2">
    <div class="flex-1 min-w-0">
      <FloatingWrapper
        name="Type"
        :required="true"
        :error="useLayoutDetail.showErr['type']"
      >
        <n-select
          v-model:value="useLayoutDetail.layoutConfig.type"
          :options="LayoutTypeOptions"
          placeholder=""
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
