<script setup lang="ts">
import Drag from '@/assets/icons/Drag.vue'
import TrashAltRegular from '@/assets/icons/TrashAltRegular.vue'
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
const draggableComponent = draggable

const categorySiteStore = useCategorySite()
const { categorySite } = storeToRefs(categorySiteStore)

const getLandingLabel = (value: any) => {
  const landing = categorySiteStore.landingOptions.find(
    (item) => item.value === value
  )
  return landing ? landing.label : value
}

const removeItem = (index: number) => {
  categorySite.value.posts?.splice(index, 1)
}
</script>

<template>
  <n-card title="Landing Page">
    <CategorySitePosts />

    <draggableComponent
      v-model="categorySite.posts"
      item-key="id"
      class="space-y-2 max-h-[50dvh] overflow-y-scroll"
      :animation="300"
      :scroll="true"
      :scroll-speed="10"
    >
      <template #item="{ element, index }">
        <div
          class="p-4 bg-white border rounded shadow-sm flex justify-between items-center cursor-move"
        >
          <div class="flex gap-2 items-center">
            <span>{{ index + 1 }}.</span>
            <span class="font-medium select-text cursor-text">
              {{ `${element} - ${getLandingLabel(element)}` }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <n-icon :component="Drag" size="14" />
            <n-button
              quaternary
              size="tiny"
              type="error"
              @click="removeItem(index)"
            >
              <template #icon>
                <n-icon :component="TrashAltRegular" />
              </template>
            </n-button>
          </div>
        </div>
      </template>
    </draggableComponent>
  </n-card>
</template>
