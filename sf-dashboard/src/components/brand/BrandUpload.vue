<script lang="ts" setup>
import useBrandStore from '@/store/useBrandStore'
import { storeToRefs } from 'pinia'
import Upload from '../common/Upload.vue'

const brandStore = useBrandStore()
const { currentBrand } = storeToRefs(brandStore)
const name = 'Logo Brand'
</script>
<template>
  <div class="flex gap-2 items-center">
    <div class="w-150-px font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <Upload v-model="currentBrand.logo" />
    </div>
  </div>
</template>
