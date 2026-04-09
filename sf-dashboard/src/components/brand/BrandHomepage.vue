<script lang="ts" setup>
import useBrandStore from '@/store/useBrandStore'
import { storeToRefs } from 'pinia'

const brandStore = useBrandStore()
const { currentBrand } = storeToRefs(brandStore)
const name = 'Home Page'
</script>
<template>
  <div class="flex gap-2 items-center">
    <div class="w-150-px font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <n-input
        v-model:value="currentBrand.home_page"
        :placeholder="`Enter ${name.toLocaleLowerCase()}`"
      />
    </div>
  </div>
</template>
