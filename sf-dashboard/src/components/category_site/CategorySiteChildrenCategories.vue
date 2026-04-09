<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'

const categorySiteStore = useCategorySite()
const { categorySite, parentCategories } = storeToRefs(categorySiteStore)

onMounted(() => {
  categorySiteStore.getParentCategory()
})
</script>

<template>
  <div class="flex gap-2 items-center">
    <div class="w-150-px font-bold">Children Category</div>
    <div class="flex-1 min-w-0">
      <n-select
        v-model:value="categorySite.children"
        :options="parentCategories"
        value-field="id"
        multiple
        filterable
        clearable
        max-tag-count="responsive"
        placeholder="Select children categories"
        :render-label="categorySiteStore.renderLabelCategorySite"
        :filter="categorySiteStore.customFilterCategory"
      />
    </div>
  </div>
</template>
