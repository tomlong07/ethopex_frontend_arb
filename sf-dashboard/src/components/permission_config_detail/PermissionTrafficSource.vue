<script setup lang="ts">
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePermissionConfigDetail = PermissionConfigDetail()
</script>
<template>
  <FloatingWrapper name="Traffic Source" rounded>
    <n-select
      v-model:value="usePermissionConfigDetail.permission.traffic_source"
      label-field="value"
      value-field="key"
      placeholder=""
      multiple
      clearable
      :options="usePermissionConfigDetail.trafficOptions"
    />
  </FloatingWrapper>
</template>
