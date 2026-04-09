<script setup lang="ts">
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePermissionConfigDetail = PermissionConfigDetail()
</script>
<template>
  <FloatingWrapper name="Role Inheritance" rounded>
    <n-select
      v-model:value="usePermissionConfigDetail.permission.role_inheritance"
      label-field="value"
      value-field="key"
      placeholder=""
      multiple
      clearable
      :options="usePermissionConfigDetail.roleInheritanceOptions"
    />
  </FloatingWrapper>
</template>
