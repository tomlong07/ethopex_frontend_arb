<script setup lang="ts">
import Wallet from '@/assets/icons/Wallet.vue'
import useHeaderStore from '@/store/useHeaderStore'

const headerStore = useHeaderStore()
</script>

<template>
  <n-tag round :bordered="false" class="font-semibold bg-blue-100 text-xs">
    Wallet: ${{ headerStore.amountUserInfo.walletShow() }}
    <template #icon>
      <n-icon :component="Wallet" size="15" />
    </template>
  </n-tag>
</template>
