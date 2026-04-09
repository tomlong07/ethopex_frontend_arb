<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
import { NSwitch } from 'naive-ui'

const assetGroupStore = useAssetGroupDetail()

const name = `Status`
</script>

<template>
  <div class="flex items-center">
    <div class="w-48 font-bold">{{ name }}</div>
    <div class="w-[calc(100%-12rem)]">
      <n-switch
        v-model:value="assetGroupStore.assetGroup.status"
        checked-value="on"
        unchecked-value="off"
      />
    </div>
  </div>
</template>
