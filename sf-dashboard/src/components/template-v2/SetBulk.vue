<script setup lang="ts">
import useAccountAd from '@/store/useAccountAd'
import { useTemplateV2 } from '@/store/templateV2Store'

const accountAdStore = useAccountAd()
const templateV2Store = useTemplateV2(helper.truePath())()
</script>

<template>
  <n-button
    color="#f43f5e"
    size="small"
    :disabled="!templateV2Store.itemSelectedV2.length"
    :loading="accountAdStore.isSubmittingBulk"
    @click="accountAdStore.showModalBulk = true"
  >
    Set Bulk Accounts
  </n-button>
</template>
