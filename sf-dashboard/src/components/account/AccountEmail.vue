<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()
const name = 'Email'
</script>
<template>
  <div class="flex items-center my-4">
    <div class="w-1/4 font-bold">{{ name }}</div>
    <div class="w-3/4">
      <n-input
        v-model:value="accountAdStore.accountAd.email"
        disabled
        :placeholder="name"
        class="w-96"
      />
    </div>
  </div>
</template>
