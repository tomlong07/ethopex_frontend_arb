<script lang="ts" setup>
import useBrandStore from '@/store/useBrandStore'
import { storeToRefs } from 'pinia'
import RedDot from '../common/RedDot.vue'

const brandStore = useBrandStore()
const { currentBrand } = storeToRefs(brandStore)
const name = 'Brand Name'
</script>
<template>
  <div class="flex gap-2 items-center">
    <div class="w-150-px flex gap-1 font-bold">{{ name }}<RedDot /></div>
    <div class="flex-1 min-w-0">
      <n-input
        v-model:value="currentBrand.brand_name"
        :placeholder="`Enter ${name.toLocaleLowerCase()}`"
      />
    </div>
  </div>
</template>
