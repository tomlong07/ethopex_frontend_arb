<script lang="ts" setup>
import useBrandStore from '@/store/useBrandStore'
import { storeToRefs } from 'pinia'

const brandStore = useBrandStore()
const { currentBrand } = storeToRefs(brandStore)
const name = 'Short Brand'
</script>
<template>
  <div class="flex gap-2 items-center">
    <div class="w-150-px font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <n-input
        v-model:value="currentBrand.short_brand"
        :placeholder="`Enter ${name.toLocaleLowerCase()}`"
      />
    </div>
  </div>
</template>
