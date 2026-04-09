<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'
import BaseSwitch from '@/components/common/BaseSwitch.vue'

const accountAdStore = useAccountAd()
const name = 'Status'
</script>
<template>
  <div class="flex items-center my-4">
    <div class="w-1/4 font-bold">{{ name }}</div>
    <div class="w-3/4">
      <BaseSwitch v-model="accountAdStore.accountAd.status" />
    </div>
  </div>
</template>
