<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'

const assetGroupStore = useAssetGroupDetail()

const name = `Name`
</script>

<template>
  <div class="flex items-center">
    <div class="w-48 font-bold">{{ name }}</div>
    <input
      v-model="assetGroupStore.assetGroup.name"
      type="text"
      :style="name"
      :placeholder="`Enter ${name}`"
      maxlength="255"
      class="w-[calc(100%-12rem)] border rounded px-2 py-1 outline-none focus:border-blue-400"
    />
  </div>
</template>
