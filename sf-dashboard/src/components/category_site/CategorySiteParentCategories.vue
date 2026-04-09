<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const categorySiteStore = useCategorySite()
const { categorySite, parentCategories } = storeToRefs(categorySiteStore)

onMounted(() => {
  categorySiteStore.getParentCategory()
})
</script>

<template>
  <div class="flex gap-2 items-center">
    <FloatingWrapper name="Parent Category">
      <div class="flex-1 min-w-0">
        <n-select
          v-model:value="categorySite.parents"
          :options="parentCategories"
          value-field="id"
          multiple
          filterable
          clearable
          max-tag-count="responsive"
          :filter="categorySiteStore.customFilterCategory"
          placeholder="Select parent categories"
          :render-label="categorySiteStore.renderLabelCategorySite"
        />
      </div>
    </FloatingWrapper>
  </div>
</template>
