<script setup lang="ts">
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePermissionConfigDetail = PermissionConfigDetail()
</script>
<template>
  <FloatingWrapper name="Name" rounded>
    <n-input
      v-model:value="usePermissionConfigDetail.permission.name"
      placeholder="Enter name of config"
      maxlength="500"
    />
  </FloatingWrapper>
</template>
