<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()
const name = 'Pixel Token'
</script>
<template>
  <div class="flex items-center my-4">
    <div class="w-1/4 font-bold">{{ name }}</div>
    <div class="w-3/4">
      <n-input
        v-model:value="accountAdStore.accountAd.pixel_token"
        :placeholder="name"
        type="password"
        show-password-on="click"
        class="w-96"
      />
    </div>
  </div>
</template>
