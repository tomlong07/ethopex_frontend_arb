<script lang="ts" setup>
import AccountFilter from './cell/AccountFilter.vue'
import AccountHeader from './cell/AccountHeader.vue'
import AccountTable from './cell/AccountTable.vue'
</script>
<template>
  <n-card title="Account Ads" class="mb-4">
    <div class="w-full min-h-[400px]">
      <AccountHeader />
      <AccountFilter />
      <AccountTable />
    </div>
  </n-card>
</template>
