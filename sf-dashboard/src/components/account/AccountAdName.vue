<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()
</script>
<template>
  <div class="flex items-center my-4">
    <div class="w-1/4 font-bold">Name</div>
    <div class="w-3/4">
      <n-input
        v-model:value="accountAdStore.accountAd.name"
        :disabled="
          !accountAdStore.isGoogleAccount && !accountAdStore.isGeneralAccount
        "
        placeholder="Name"
        class="w-96"
      />
    </div>
  </div>
</template>
