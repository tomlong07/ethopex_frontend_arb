<script setup lang="ts">
import { TypeCategorySiteBuilder } from '@/options/category_site_builder'
import useCategorySite from '@/store/useCategorySite'
import { categorySiteCls } from '@/types/components/category_site'
import { storeToRefs } from 'pinia'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const categorySiteStore = useCategorySite()
const { categorySite, isEditPage } = storeToRefs(categorySiteStore)

const handleChangeType = (option: string | null) => {
  if (option) {
    categorySite.value.type = option
  }
}

watch(
  () => categorySite.value.type,
  () => {
    if (categorySite.value.IsTypeCategory()) {
      categorySite.value.keyword_group = null
    } else {
      categorySite.value.parents = null
      categorySite.value.children = null
      categorySite.value.icon = null

      if (
        categorySite.value.keyword_group &&
        categorySite.value.keyword_group.length > 0
      ) {
        categorySite.value = new categorySiteCls(categorySite.value)
      } else {
        categorySite.value.keyword_group =
          categorySite.value.SetKeyWordGroupDefaultList()
      }
    }
  }
)
</script>

<template>
  <div class="flex gap-2 items-center">
    <FloatingWrapper name="Type">
      <div class="flex-1 min-w-0">
        <n-select
          v-model:value="categorySite.type"
          :options="TypeCategorySiteBuilder"
          clearable
          placeholder="Select type"
          @update:value="handleChangeType"
          :disabled="isEditPage"
        />
      </div>
    </FloatingWrapper>
  </div>
</template>
