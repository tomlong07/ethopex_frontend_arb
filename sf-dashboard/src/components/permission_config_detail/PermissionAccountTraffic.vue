<script setup lang="ts">
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePermissionConfigDetail = PermissionConfigDetail()
</script>
<template>
  <FloatingWrapper name="Account Traffic" rounded>
    <n-select
      v-model:value="usePermissionConfigDetail.permission.account_traffic"
      label-field="value"
      value-field="key"
      placeholder=""
      filterable
      multiple
      clearable
      :options="usePermissionConfigDetail.trafficAccountOptions"
    />
  </FloatingWrapper>
</template>
