<script setup lang="ts">
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePermissionConfigDetail = PermissionConfigDetail()
</script>
<template>
  <FloatingWrapper name="Description" rounded>
    <n-input
      v-model:value="usePermissionConfigDetail.permission.description"
      placeholder="Description of config"
      :maxlength="500"
    />
  </FloatingWrapper>
</template>
