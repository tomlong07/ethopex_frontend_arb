<script setup lang="ts">
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePermissionConfigDetail = PermissionConfigDetail()
</script>
<template>
  <FloatingWrapper name="Account Demand" rounded>
    <n-select
      v-model:value="usePermissionConfigDetail.permission.account_demand"
      label-field="value"
      value-field="key"
      placeholder=""
      filterable
      multiple
      clearable
      :options="usePermissionConfigDetail.demandAccountOptions"
    />
  </FloatingWrapper>
</template>
