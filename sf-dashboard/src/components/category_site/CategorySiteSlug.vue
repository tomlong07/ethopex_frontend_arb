<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const categorySiteStore = useCategorySite()
const { categorySite } = storeToRefs(categorySiteStore)
</script>

<template>
  <div class="flex gap-2 items-center">
    <FloatingWrapper name="Slug">
      <div class="flex-1 min-w-0">
        <n-input v-model:value="categorySite.slug" disabled />
      </div>
    </FloatingWrapper>
  </div>
</template>
