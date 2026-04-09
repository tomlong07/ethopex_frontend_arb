<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()

const actionModal = () => {
  accountAdStore.showModalReconnect = !accountAdStore.showModalReconnect
}
</script>
<template>
  <n-button
    color="#f43f5e"
    size="small"
    @click="actionModal"
    v-if="!accountAdStore.isGeneralAccount"
  >
    Re-connect
  </n-button>
</template>
