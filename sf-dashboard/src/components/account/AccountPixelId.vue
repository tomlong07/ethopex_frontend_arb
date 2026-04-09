<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()
const name = 'Pixel ID'
</script>
<template>
  <div class="flex items-center my-4">
    <div class="w-1/4 font-bold">{{ name }}</div>
    <div class="w-3/4">
      <n-input
        v-model:value="accountAdStore.accountAd.pixel_id"
        :placeholder="name"
        class="w-96"
      />
    </div>
  </div>
</template>
