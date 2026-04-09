<script setup lang="ts">
import useRoleStore from '@/store/useRoleStore'
import { useTemplateV2 } from '@/store/templateV2Store'
const templateV2Store = useTemplateV2(helper.truePath())()

const roleStore = useRoleStore()
</script>

<template>
  <n-button
    color="#f43f5e"
    size="small"
    :disabled="!templateV2Store.itemSelectedV2.length"
    :loading="roleStore.isSubmitting"
    @click="roleStore.showModal = true"
  >
    Set Account Demand
  </n-button>
</template>
